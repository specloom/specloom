import { type Component, Switch, Match, Show } from "solid-js";
import { Index, Portal } from "solid-js/web";
import { Field } from "@ark-ui/solid/field";
import { NumberInput } from "@ark-ui/solid/number-input";
import { Select, createListCollection } from "@ark-ui/solid/select";
import { Switch as ArkSwitch } from "@ark-ui/solid/switch";
import type { FormFieldVM } from "specloom";
import {
  inputClasses,
  selectContentClasses,
  selectItemClasses,
  selectTriggerClasses,
  textareaClasses,
} from "../ui/index.js";

export interface FieldInputProps {
  field: FormFieldVM;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}

export const FieldInput: Component<FieldInputProps> = (props) => {
  return (
    <Switch fallback={<TextInput {...props} />}>
      <Match when={props.field.kind === "text"}>
        <TextInput {...props} />
      </Match>

      <Match
        when={props.field.kind === "longText" || props.field.kind === "json"}
      >
        <TextareaInput {...props} />
      </Match>

      <Match
        when={
          props.field.kind === "number" ||
          props.field.kind === "currency" ||
          props.field.kind === "percent"
        }
      >
        <NumberInputField {...props} />
      </Match>

      <Match when={props.field.kind === "boolean"}>
        <BooleanInput {...props} />
      </Match>

      <Match
        when={props.field.kind === "enum" || props.field.kind === "status"}
      >
        <EnumInput {...props} />
      </Match>

      <Match when={props.field.kind === "relation"}>
        <EnumInput {...props} />
      </Match>

      <Match when={props.field.kind === "date"}>
        <DateInput {...props} />
      </Match>

      <Match when={props.field.kind === "datetime"}>
        <DateTimeInput {...props} />
      </Match>

      <Match when={props.field.kind === "time"}>
        <TimeInput {...props} />
      </Match>

      <Match when={props.field.kind === "email"}>
        <EmailInput {...props} />
      </Match>

      <Match when={props.field.kind === "url"}>
        <UrlInput {...props} />
      </Match>

      <Match when={props.field.kind === "tel"}>
        <TelInput {...props} />
      </Match>

      <Match when={props.field.kind === "password"}>
        <PasswordInput {...props} />
      </Match>

      <Match when={props.field.kind === "file" || props.field.kind === "image"}>
        <FileInput {...props} />
      </Match>
    </Switch>
  );
};

// Text input using Ark Field
const TextInput: Component<FieldInputProps> = (props) => {
  const hasError = () => props.field.errors.length > 0;

  return (
    <Field.Root
      invalid={hasError()}
      disabled={props.field.readonly}
      required={props.field.required}
    >
      <Field.Input
        value={String(props.value ?? "")}
        placeholder={props.field.placeholder}
        onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
        class={inputClasses("data-[invalid]:border-destructive")}
      />
    </Field.Root>
  );
};

// Textarea input
const TextareaInput: Component<FieldInputProps> = (props) => {
  const hasError = () => props.field.errors.length > 0;

  return (
    <Field.Root
      invalid={hasError()}
      disabled={props.field.readonly}
      required={props.field.required}
    >
      <Field.Textarea
        value={String(props.value ?? "")}
        placeholder={props.field.placeholder}
        rows={4}
        onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
        class={textareaClasses("data-[invalid]:border-destructive")}
      />
    </Field.Root>
  );
};

// Number input using Ark NumberInput
const NumberInputField: Component<FieldInputProps> = (props) => {
  return (
    <NumberInput.Root
      value={props.value != null ? String(props.value) : ""}
      onValueChange={(e) =>
        props.onChange(
          props.field.name,
          Number.isNaN(e.valueAsNumber) ? undefined : e.valueAsNumber,
        )
      }
      disabled={props.field.readonly}
      min={props.field.validation?.min}
      max={props.field.validation?.max}
    >
      <div class="flex">
        <NumberInput.Input
          class={inputClasses("flex-1 rounded-r-none")}
        />
        <NumberInput.Control class="flex flex-col border border-l-0 border-input rounded-r-md bg-background">
          <NumberInput.IncrementTrigger class="px-2 py-1 hover:bg-accent border-b border-input">
            ▲
          </NumberInput.IncrementTrigger>
          <NumberInput.DecrementTrigger class="px-2 py-1 hover:bg-accent">
            ▼
          </NumberInput.DecrementTrigger>
        </NumberInput.Control>
      </div>
    </NumberInput.Root>
  );
};

// Boolean input using Ark Switch
const BooleanInput: Component<FieldInputProps> = (props) => {
  return (
    <ArkSwitch.Root
      checked={Boolean(props.value)}
      onCheckedChange={(e) => props.onChange(props.field.name, e.checked)}
      disabled={props.field.readonly}
    >
      <ArkSwitch.Control class="inline-flex h-6 w-11 items-center rounded-full border border-input bg-input transition-colors data-[state=checked]:bg-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        <ArkSwitch.Thumb class="h-5 w-5 rounded-full bg-background shadow-sm transform translate-x-0.5 data-[state=checked]:translate-x-[22px] transition-transform" />
      </ArkSwitch.Control>
      <ArkSwitch.HiddenInput />
    </ArkSwitch.Root>
  );
};

// Enum/Select input using Ark Select
const EnumInput: Component<FieldInputProps> = (props) => {
  const collection = () =>
    createListCollection({
      items: props.field.options ?? [],
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    });

  return (
    <Select.Root
      collection={collection()}
      value={props.value != null ? [String(props.value)] : []}
      onValueChange={(e) => props.onChange(props.field.name, e.value[0])}
      disabled={props.field.readonly}
    >
      <Select.Control>
        <Select.Trigger class={selectTriggerClasses()}>
          <Select.ValueText
            placeholder={props.field.placeholder ?? "選択してください"}
          />
          <Select.Indicator>▼</Select.Indicator>
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content class={selectContentClasses("py-1")}>
            <Select.ItemGroup>
              <Index each={collection().items}>
                {(item) => (
                  <Select.Item
                    item={item()}
                    class={selectItemClasses("justify-between")}
                  >
                    <Select.ItemText>{item().label}</Select.ItemText>
                    <Select.ItemIndicator>✓</Select.ItemIndicator>
                  </Select.Item>
                )}
              </Index>
            </Select.ItemGroup>
          </Select.Content>
        </Select.Positioner>
      </Portal>
      <Select.HiddenSelect />
    </Select.Root>
  );
};

// Date input
const DateInput: Component<FieldInputProps> = (props) => {
  return (
    <Field.Root disabled={props.field.readonly} required={props.field.required}>
      <Field.Input
        type="date"
        value={props.value ? String(props.value).split("T")[0] : ""}
        onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
        class={inputClasses()}
      />
    </Field.Root>
  );
};

// DateTime input
const DateTimeInput: Component<FieldInputProps> = (props) => {
  return (
    <Field.Root disabled={props.field.readonly} required={props.field.required}>
      <Field.Input
        type="datetime-local"
        value={props.value ? String(props.value).slice(0, 16) : ""}
        onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
        class={inputClasses()}
      />
    </Field.Root>
  );
};

// Time input
const TimeInput: Component<FieldInputProps> = (props) => {
  return (
    <Field.Root disabled={props.field.readonly} required={props.field.required}>
      <Field.Input
        type="time"
        value={String(props.value ?? "")}
        onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
        class={inputClasses()}
      />
    </Field.Root>
  );
};

// Email input
const EmailInput: Component<FieldInputProps> = (props) => {
  return (
    <Field.Root disabled={props.field.readonly} required={props.field.required}>
      <Field.Input
        type="email"
        value={String(props.value ?? "")}
        placeholder={props.field.placeholder}
        onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
        class={inputClasses()}
      />
    </Field.Root>
  );
};

// URL input
const UrlInput: Component<FieldInputProps> = (props) => {
  return (
    <Field.Root disabled={props.field.readonly} required={props.field.required}>
      <Field.Input
        type="url"
        value={String(props.value ?? "")}
        placeholder={props.field.placeholder}
        onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
        class={inputClasses()}
      />
    </Field.Root>
  );
};

// Tel input
const TelInput: Component<FieldInputProps> = (props) => {
  return (
    <Field.Root disabled={props.field.readonly} required={props.field.required}>
      <Field.Input
        type="tel"
        value={String(props.value ?? "")}
        placeholder={props.field.placeholder}
        onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
        class={inputClasses()}
      />
    </Field.Root>
  );
};

// Password input
const PasswordInput: Component<FieldInputProps> = (props) => {
  return (
    <Field.Root disabled={props.field.readonly} required={props.field.required}>
      <Field.Input
        type="password"
        value={String(props.value ?? "")}
        placeholder={props.field.placeholder}
        onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
        class={inputClasses()}
      />
    </Field.Root>
  );
};

// File input
const FileInput: Component<FieldInputProps> = (props) => {
  const isImage = () => props.field.kind === "image";

  return (
    <div class="flex flex-col gap-2">
      <input
        type="file"
        accept={isImage() ? "image/*" : undefined}
        disabled={props.field.readonly}
        class={inputClasses()}
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          props.onChange(props.field.name, file ?? null);
        }}
      />
      <Show when={isImage() && props.value && typeof props.value === "string"}>
        <img
          src={props.value as string}
          alt=""
          class="max-w-48 max-h-48 rounded-md border border-border"
        />
      </Show>
    </div>
  );
};
