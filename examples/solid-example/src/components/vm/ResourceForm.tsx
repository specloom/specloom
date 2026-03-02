import { For, Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import type { FormVM, FormFieldVM } from "specloom";
import {
  TextField,
  TextFieldInput,
  TextFieldTextArea,
  TextFieldLabel,
  TextFieldErrorMessage,
} from "~/components/ui/text-field";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import {
  Switch,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
} from "~/components/ui/switch";
import { Button } from "~/components/ui/button";

interface ResourceFormProps {
  vm: FormVM;
  basePath: string;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onChange?: (name: string, value: unknown) => void;
}

type InputType = "text" | "email" | "tel" | "url" | "password" | "number" | "date" | "datetime-local" | "time";

function inputTypeForKind(kind: string): InputType {
  switch (kind) {
    case "email": return "email";
    case "tel": return "tel";
    case "url": return "url";
    case "password": return "password";
    case "number":
    case "integer":
    case "currency":
    case "percent": return "number";
    case "date": return "date";
    case "datetime": return "datetime-local";
    case "time": return "time";
    default: return "text";
  }
}

export function ResourceForm(props: ResourceFormProps) {
  const [vm, setVm] = createSignal(props.vm);
  const [submitting, setSubmitting] = createSignal(false);
  const navigate = useNavigate();

  const handleChange = (name: string, value: unknown) => {
    setVm((v) => v.setValue(name, value));
    props.onChange?.(name, value);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const validated = vm().validate();
    setVm(validated);
    if (validated.hasErrors) return;

    setSubmitting(true);
    try {
      await props.onSubmit(validated.submittableValues);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <For each={vm().visibleFields}>
          {(field: FormFieldVM) => (
            <FormField
              field={field}
              onChange={(value) => handleChange(field.name, value)}
            />
          )}
        </For>
      </div>

      <div class="flex gap-2">
        <Button type="submit" disabled={submitting()}>
          {vm().mode === "create" ? "作成" : "更新"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(props.basePath)}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}

function FormField(props: {
  field: FormFieldVM;
  onChange: (value: unknown) => void;
}) {
  const field = () => props.field;
  const kind = () => field().kind;
  const hasError = () => field().errors.length > 0;

  // Boolean → Switch
  if (kind() === "boolean") {
    return (
      <div class="flex items-center gap-3 py-2">
        <Switch
          checked={!!field().value}
          onChange={(checked: boolean) => props.onChange(checked)}
          disabled={field().readonly}
        >
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>{field().label}</SwitchLabel>
        </Switch>
      </div>
    );
  }

  // Enum / Status → Select
  if ((kind() === "enum" || kind() === "status") && field().options?.length) {
    const options = () => field().options ?? [];
    return (
      <div class="space-y-1">
        <Select
          value={field().value as string}
          onChange={(val: string | null) => props.onChange(val ?? "")}
          options={options().map((o) => o.value)}
          itemComponent={(itemProps) => (
            <SelectItem item={itemProps.item}>
              {options().find((o) => o.value === itemProps.item.rawValue)?.label ?? itemProps.item.rawValue}
            </SelectItem>
          )}
          disabled={field().readonly}
        >
          <label class="text-sm font-medium leading-none">
            {field().label}
            <Show when={field().required}>
              <span class="text-destructive ml-1">*</span>
            </Show>
          </label>
          <SelectTrigger>
            <SelectValue<string>>
              {(state) => {
                const opt = options().find((o) => o.value === state.selectedOption());
                return <>{opt?.label ?? state.selectedOption()}</>;
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
        <Show when={hasError()}>
          <p class="text-xs text-destructive">{field().errors[0]}</p>
        </Show>
      </div>
    );
  }

  // LongText → Textarea
  if (kind() === "longText") {
    return (
      <TextField
        value={String(field().value ?? "")}
        onChange={(val: string) => props.onChange(val)}
        validationState={hasError() ? "invalid" : "valid"}
        disabled={field().readonly}
      >
        <TextFieldLabel>
          {field().label}
          <Show when={field().required}>
            <span class="text-destructive ml-1">*</span>
          </Show>
        </TextFieldLabel>
        <TextFieldTextArea
          placeholder={field().placeholder}
        />
        <Show when={hasError()}>
          <TextFieldErrorMessage>{field().errors[0]}</TextFieldErrorMessage>
        </Show>
      </TextField>
    );
  }

  // Default → Input
  return (
    <TextField
      value={String(field().value ?? "")}
      onChange={(val: string) => {
        const type = inputTypeForKind(kind());
        props.onChange(type === "number" ? (val === "" ? null : Number(val)) : val);
      }}
      validationState={hasError() ? "invalid" : "valid"}
      disabled={field().readonly}
    >
      <TextFieldLabel>
        {field().label}
        <Show when={field().required}>
          <span class="text-destructive ml-1">*</span>
        </Show>
      </TextFieldLabel>
      <TextFieldInput
        type={inputTypeForKind(kind())}
        placeholder={field().placeholder}
      />
      <Show when={hasError()}>
        <TextFieldErrorMessage>{field().errors[0]}</TextFieldErrorMessage>
      </Show>
    </TextField>
  );
}
