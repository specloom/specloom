import {
  type Component,
  Switch,
  Match,
  Show,
  createSignal,
  createResource,
} from "solid-js";
import { Index, Portal } from "solid-js/web";
import { Field } from "@ark-ui/solid/field";

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

export interface RelationOption {
  value: string;
  label: string;
}

export interface FieldInputProps {
  field: FormFieldVM;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
  /** リレーションフィールドのオプション検索コールバック */
  onOptionsSearch?: (
    resource: string,
    query: string,
  ) => Promise<RelationOption[]>;
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
        <RelationInput {...props} />
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

// Number input
const NumberInputField: Component<FieldInputProps> = (props) => {
  return (
    <Field.Root disabled={props.field.readonly} required={props.field.required}>
      <Field.Input
        type="number"
        value={props.value != null ? String(props.value) : ""}
        placeholder={props.field.placeholder}
        min={props.field.validation?.min}
        max={props.field.validation?.max}
        onInput={(e) => {
          const val = e.currentTarget.valueAsNumber;
          props.onChange(props.field.name, Number.isNaN(val) ? undefined : val);
        }}
        class={inputClasses()}
      />
    </Field.Root>
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

// Relation input with async search support
const RelationInput: Component<FieldInputProps> = (props) => {
  const [query, setQuery] = createSignal("");
  const [isOpen, setIsOpen] = createSignal(false);

  // 静的 options がある場合はそれを使用、なければ onOptionsSearch を呼ぶ
  const [options] = createResource(
    () => ({ query: query(), isOpen: isOpen() }),
    async ({ query: q, isOpen: open }) => {
      // 静的 options がある場合
      if (props.field.options && props.field.options.length > 0) {
        const filtered = props.field.options.filter((opt) =>
          opt.label.toLowerCase().includes(q.toLowerCase()),
        );
        return filtered;
      }

      // 動的検索
      if (props.onOptionsSearch && props.field.relation && open) {
        return await props.onOptionsSearch(props.field.relation.resource, q);
      }

      return [];
    },
  );

  // 現在の値のラベルを取得
  const currentLabel = () => {
    const val = props.value;
    if (val == null) return "";

    // options から探す
    const opt = props.field.options?.find((o) => o.value === String(val));
    if (opt) return opt.label;

    // 取得済み options から探す
    const loadedOpt = options()?.find((o) => o.value === String(val));
    if (loadedOpt) return loadedOpt.label;

    // 見つからない場合は値をそのまま表示
    return String(val);
  };

  const collection = () =>
    createListCollection({
      items: options() ?? [],
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    });

  return (
    <Select.Root
      collection={collection()}
      value={props.value != null ? [String(props.value)] : []}
      onValueChange={(e) => props.onChange(props.field.name, e.value[0])}
      onOpenChange={(e) => setIsOpen(e.open)}
      disabled={props.field.readonly}
    >
      <Select.Control>
        <Select.Trigger class={selectTriggerClasses()}>
          <Select.ValueText
            placeholder={props.field.placeholder ?? "選択してください"}
          >
            {currentLabel() || props.field.placeholder || "選択してください"}
          </Select.ValueText>
          <Show when={options.loading}>
            <span class="animate-spin text-muted-foreground">⟳</span>
          </Show>
          <Select.Indicator>▼</Select.Indicator>
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content class={selectContentClasses("py-1")}>
            {/* 検索入力 */}
            <Show when={props.onOptionsSearch}>
              <div class="p-2 border-b border-border">
                <input
                  type="text"
                  value={query()}
                  onInput={(e) => setQuery(e.currentTarget.value)}
                  placeholder="検索..."
                  class={inputClasses("h-8")}
                />
              </div>
            </Show>
            <Select.ItemGroup>
              <Show
                when={!options.loading && (options()?.length ?? 0) > 0}
                fallback={
                  <div class="px-3 py-2 text-sm text-muted-foreground">
                    {options.loading ? "読み込み中..." : "選択肢がありません"}
                  </div>
                }
              >
                <Index each={options()}>
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
              </Show>
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
