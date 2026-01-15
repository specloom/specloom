import { Match, Switch, For, Show } from "solid-js";
import { Field } from "@ark-ui/solid/field";
import { Select, createListCollection } from "@ark-ui/solid/select";
import { NumberInput } from "@ark-ui/solid/number-input";
import { Switch as SwitchInput } from "@ark-ui/solid/switch";
import type { FormFieldVM, ShowFieldVM } from "specloom";

// ============================================================
// Types
// ============================================================

export interface FieldRendererProps {
  field: FormFieldVM | ShowFieldVM;
  mode: "display" | "input";
  onChange?: (value: unknown) => void;
}

// Type guard for FormFieldVM
function isFormField(
  field: FormFieldVM | ShowFieldVM
): field is FormFieldVM {
  return "errors" in field;
}

// ============================================================
// FieldRenderer Component
// ============================================================

export function FieldRenderer(props: FieldRendererProps) {
  const hasErrors = () => {
    if (isFormField(props.field)) {
      return props.field.errors.length > 0;
    }
    return false;
  };

  return (
    <Field.Root invalid={hasErrors()}>
      <Switch>
        {/* Display Mode */}
        <Match when={props.mode === "display"}>
          <DisplayField field={props.field} />
        </Match>

        {/* Input Mode */}
        <Match when={props.mode === "input"}>
          <InputField
            field={props.field as FormFieldVM}
            onChange={props.onChange}
          />
        </Match>
      </Switch>

      {/* Error Messages */}
      <Show when={isFormField(props.field) && props.field.errors.length > 0}>
        <For each={(props.field as FormFieldVM).errors}>
          {(error) => <Field.ErrorText>{error}</Field.ErrorText>}
        </For>
      </Show>
    </Field.Root>
  );
}

// ============================================================
// Display Field (for ShowView)
// ============================================================

interface DisplayFieldProps {
  field: FormFieldVM | ShowFieldVM;
}

function DisplayField(props: DisplayFieldProps) {
  return (
    <div>
      <Field.Label>{props.field.label}</Field.Label>
      <div>
        <Switch fallback={<span>{String(props.field.value ?? "")}</span>}>
          <Match when={props.field.kind === "boolean"}>
            <span>{props.field.value ? "Yes" : "No"}</span>
          </Match>

          <Match when={props.field.kind === "enum" || props.field.kind === "status"}>
            <EnumDisplay
              value={props.field.value as string}
              options={props.field.options}
            />
          </Match>

          <Match when={props.field.kind === "relation"}>
            <RelationDisplay value={props.field.value} />
          </Match>

          <Match when={props.field.kind === "date"}>
            <span>{formatDate(props.field.value as string)}</span>
          </Match>

          <Match when={props.field.kind === "datetime"}>
            <span>{formatDateTime(props.field.value as string)}</span>
          </Match>
        </Switch>
      </div>
    </div>
  );
}

// ============================================================
// Input Field (for FormView)
// ============================================================

interface InputFieldProps {
  field: FormFieldVM;
  onChange?: (value: unknown) => void;
}

function InputField(props: InputFieldProps) {
  return (
    <Switch fallback={<TextInput field={props.field} onChange={props.onChange} />}>
      {/* Text variants */}
      <Match when={props.field.kind === "text" || props.field.kind === "email" || props.field.kind === "url" || props.field.kind === "tel"}>
        <TextInput field={props.field} onChange={props.onChange} />
      </Match>

      {/* Password */}
      <Match when={props.field.kind === "password"}>
        <PasswordInput field={props.field} onChange={props.onChange} />
      </Match>

      {/* Long text */}
      <Match when={props.field.kind === "longText"}>
        <TextareaInput field={props.field} onChange={props.onChange} />
      </Match>

      {/* Number variants */}
      <Match when={props.field.kind === "number" || props.field.kind === "currency" || props.field.kind === "percent"}>
        <NumberInputField field={props.field} onChange={props.onChange} />
      </Match>

      {/* Boolean */}
      <Match when={props.field.kind === "boolean"}>
        <BooleanInput field={props.field} onChange={props.onChange} />
      </Match>

      {/* Enum / Status */}
      <Match when={props.field.kind === "enum" || props.field.kind === "status"}>
        <SelectInput field={props.field} onChange={props.onChange} />
      </Match>

      {/* Relation */}
      <Match when={props.field.kind === "relation"}>
        <RelationInput field={props.field} onChange={props.onChange} />
      </Match>
    </Switch>
  );
}

// ============================================================
// Input Components
// ============================================================

function TextInput(props: InputFieldProps) {
  const inputType = () => {
    switch (props.field.kind) {
      case "email": return "email";
      case "url": return "url";
      case "tel": return "tel";
      default: return "text";
    }
  };

  return (
    <>
      <Field.Label>{props.field.label}</Field.Label>
      <Field.Input
        type={inputType()}
        value={String(props.field.value ?? "")}
        required={props.field.required}
        readOnly={props.field.readonly}
        onInput={(e) => props.onChange?.(e.currentTarget.value)}
      />
    </>
  );
}

function PasswordInput(props: InputFieldProps) {
  return (
    <>
      <Field.Label>{props.field.label}</Field.Label>
      <Field.Input
        type="password"
        value={String(props.field.value ?? "")}
        required={props.field.required}
        readOnly={props.field.readonly}
        onInput={(e) => props.onChange?.(e.currentTarget.value)}
      />
    </>
  );
}

function TextareaInput(props: InputFieldProps) {
  return (
    <>
      <Field.Label>{props.field.label}</Field.Label>
      <Field.Textarea
        value={String(props.field.value ?? "")}
        required={props.field.required}
        readOnly={props.field.readonly}
        onInput={(e) => props.onChange?.(e.currentTarget.value)}
      />
    </>
  );
}

function NumberInputField(props: InputFieldProps) {
  return (
    <NumberInput.Root
      value={String(props.field.value ?? "")}
      disabled={props.field.readonly}
      min={props.field.validation?.min}
      max={props.field.validation?.max}
      onValueChange={(details) => props.onChange?.(details.valueAsNumber)}
    >
      <NumberInput.Label>{props.field.label}</NumberInput.Label>
      <NumberInput.Input />
      <NumberInput.Control>
        <NumberInput.DecrementTrigger>-</NumberInput.DecrementTrigger>
        <NumberInput.IncrementTrigger>+</NumberInput.IncrementTrigger>
      </NumberInput.Control>
    </NumberInput.Root>
  );
}

function BooleanInput(props: InputFieldProps) {
  return (
    <SwitchInput.Root
      checked={Boolean(props.field.value)}
      disabled={props.field.readonly}
      onCheckedChange={(details) => props.onChange?.(details.checked)}
    >
      <SwitchInput.Control>
        <SwitchInput.Thumb />
      </SwitchInput.Control>
      <SwitchInput.Label>{props.field.label}</SwitchInput.Label>
      <SwitchInput.HiddenInput />
    </SwitchInput.Root>
  );
}

function SelectInput(props: InputFieldProps) {
  const collection = () =>
    createListCollection({
      items: props.field.options ?? [],
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    });

  return (
    <Select.Root
      collection={collection()}
      value={props.field.value ? [String(props.field.value)] : []}
      disabled={props.field.readonly}
      onValueChange={(details) => props.onChange?.(details.value[0])}
    >
      <Select.Label>{props.field.label}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="選択してください" />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <For each={props.field.options}>
            {(option) => (
              <Select.Item item={option}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator>✓</Select.ItemIndicator>
              </Select.Item>
            )}
          </For>
        </Select.Content>
      </Select.Positioner>
      <Select.HiddenSelect />
    </Select.Root>
  );
}

function RelationInput(props: InputFieldProps) {
  // TODO: Implement relation input with autocomplete/combobox
  // For now, show as text input
  const displayValue = () => {
    const val = props.field.value as Record<string, unknown> | null;
    if (!val) return "";
    const labelField = props.field.relation?.labelField ?? "name";
    return String(val[labelField] ?? val.id ?? "");
  };

  return (
    <>
      <Field.Label>{props.field.label}</Field.Label>
      <Field.Input
        type="text"
        value={displayValue()}
        readOnly
        placeholder="リレーション（未実装）"
      />
    </>
  );
}

// ============================================================
// Display Components
// ============================================================

interface EnumDisplayProps {
  value: string;
  options?: Array<{ value: string; label: string }>;
}

function EnumDisplay(props: EnumDisplayProps) {
  const label = () => {
    const option = props.options?.find((o) => o.value === props.value);
    return option?.label ?? props.value;
  };

  return <span>{label()}</span>;
}

interface RelationDisplayProps {
  value: unknown;
}

function RelationDisplay(props: RelationDisplayProps) {
  const displayValue = () => {
    const val = props.value as Record<string, unknown> | null;
    if (!val) return "-";
    // Try common label fields
    return String(val.name ?? val.title ?? val.label ?? val.id ?? "-");
  };

  return <span>{displayValue()}</span>;
}

// ============================================================
// Helpers
// ============================================================

function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}
