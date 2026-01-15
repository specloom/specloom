import { Switch, Match, Show } from "solid-js";
import { Index, Portal } from "solid-js/web";
import { NumberInput } from "@ark-ui/solid/number-input";
import { Select, createListCollection } from "@ark-ui/solid/select";
import { Switch as ArkSwitch } from "@ark-ui/solid/switch";
import type { FormFieldVM } from "specloom";
import { css } from "../../styled-system/css";

export interface FieldInputProps {
  field: FormFieldVM;
  value: unknown;
  errors?: string[];
  onChange: (name: string, value: unknown) => void;
}

const inputStyles = css({
  w: "full",
  px: 3,
  py: 2,
  borderWidth: 1,
  borderColor: "gray.300",
  borderRadius: "md",
  fontSize: "md",
  _focus: {
    outline: "none",
    borderColor: "blue.500",
    ring: "2px",
    ringColor: "blue.200",
  },
  _disabled: {
    bg: "gray.100",
    cursor: "not-allowed",
  },
});

const errorInputStyles = css({
  borderColor: "red.500",
  _focus: {
    borderColor: "red.500",
    ringColor: "red.200",
  },
});

export function FieldInput(props: FieldInputProps) {
  const hasError = () => (props.errors?.length ?? 0) > 0;

  return (
    <Switch fallback={<TextInput {...props} hasError={hasError()} />}>
      {/* text - 短いテキスト入力 */}
      <Match when={props.field.kind === "text"}>
        <TextInput {...props} hasError={hasError()} />
      </Match>

      {/* longText / json - 長いテキスト入力 */}
      <Match when={props.field.kind === "longText" || props.field.kind === "json"}>
        <TextareaInput {...props} hasError={hasError()} />
      </Match>

      {/* number / currency / percent - 数値入力 */}
      <Match
        when={
          props.field.kind === "number" ||
          props.field.kind === "currency" ||
          props.field.kind === "percent"
        }
      >
        <NumberInputField {...props} hasError={hasError()} />
      </Match>

      {/* boolean - スイッチ */}
      <Match when={props.field.kind === "boolean"}>
        <BooleanInput {...props} />
      </Match>

      {/* enum / status - 選択 */}
      <Match when={props.field.kind === "enum" || props.field.kind === "status"}>
        <EnumInput {...props} hasError={hasError()} />
      </Match>

      {/* relation - リレーション選択 */}
      <Match when={props.field.kind === "relation"}>
        <RelationInput {...props} hasError={hasError()} />
      </Match>

      {/* date - 日付入力 */}
      <Match when={props.field.kind === "date"}>
        <DateInput {...props} hasError={hasError()} />
      </Match>

      {/* datetime - 日時入力 */}
      <Match when={props.field.kind === "datetime"}>
        <DateTimeInput {...props} hasError={hasError()} />
      </Match>

      {/* time - 時刻入力 */}
      <Match when={props.field.kind === "time"}>
        <TimeInput {...props} hasError={hasError()} />
      </Match>

      {/* email - メール入力 */}
      <Match when={props.field.kind === "email"}>
        <EmailInput {...props} hasError={hasError()} />
      </Match>

      {/* url - URL入力 */}
      <Match when={props.field.kind === "url"}>
        <UrlInput {...props} hasError={hasError()} />
      </Match>

      {/* tel - 電話番号入力 */}
      <Match when={props.field.kind === "tel"}>
        <TelInput {...props} hasError={hasError()} />
      </Match>

      {/* password - パスワード入力 */}
      <Match when={props.field.kind === "password"}>
        <PasswordInput {...props} hasError={hasError()} />
      </Match>

      {/* file / image - ファイル入力 */}
      <Match when={props.field.kind === "file" || props.field.kind === "image"}>
        <FileInput {...props} hasError={hasError()} />
      </Match>
    </Switch>
  );
}

function TextInput(props: FieldInputProps & { hasError: boolean }) {
  return (
    <input
      type="text"
      id={props.field.name}
      name={props.field.name}
      value={String(props.value ?? "")}
      placeholder={props.field.placeholder}
      disabled={props.field.readonly}
      class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
    />
  );
}

function TextareaInput(props: FieldInputProps & { hasError: boolean }) {
  return (
    <textarea
      id={props.field.name}
      name={props.field.name}
      value={String(props.value ?? "")}
      placeholder={props.field.placeholder}
      disabled={props.field.readonly}
      rows={4}
      class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
    />
  );
}

function NumberInputField(props: FieldInputProps & { hasError: boolean }) {
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
      <NumberInput.Input
        class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      />
      <NumberInput.Control
        class={css({
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          right: 1,
          top: "50%",
          transform: "translateY(-50%)",
        })}
      >
        <NumberInput.IncrementTrigger
          class={css({
            px: 2,
            cursor: "pointer",
            _hover: { bg: "gray.100" },
          })}
        >
          ▲
        </NumberInput.IncrementTrigger>
        <NumberInput.DecrementTrigger
          class={css({
            px: 2,
            cursor: "pointer",
            _hover: { bg: "gray.100" },
          })}
        >
          ▼
        </NumberInput.DecrementTrigger>
      </NumberInput.Control>
    </NumberInput.Root>
  );
}

function BooleanInput(props: FieldInputProps) {
  return (
    <ArkSwitch.Root
      checked={Boolean(props.value)}
      onCheckedChange={(e) => props.onChange(props.field.name, e.checked)}
      disabled={props.field.readonly}
    >
      <ArkSwitch.Control
        class={css({
          display: "inline-flex",
          alignItems: "center",
          w: 11,
          h: 6,
          borderRadius: "full",
          bg: "gray.300",
          transition: "background-color 0.2s",
          cursor: "pointer",
          _checked: { bg: "blue.500" },
          _disabled: { opacity: 0.5, cursor: "not-allowed" },
        })}
      >
        <ArkSwitch.Thumb
          class={css({
            w: 5,
            h: 5,
            borderRadius: "full",
            bg: "white",
            shadow: "sm",
            transition: "transform 0.2s",
            transform: "translateX(2px)",
            _checked: { transform: "translateX(22px)" },
          })}
        />
      </ArkSwitch.Control>
      <ArkSwitch.HiddenInput />
    </ArkSwitch.Root>
  );
}

function EnumInput(props: FieldInputProps & { hasError: boolean }) {
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
        <Select.Trigger
          class={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            w: "full",
            px: 3,
            py: 2,
            borderWidth: 1,
            borderColor: props.hasError ? "red.500" : "gray.300",
            borderRadius: "md",
            bg: "white",
            cursor: "pointer",
            _disabled: { bg: "gray.100", cursor: "not-allowed" },
          })}
        >
          <Select.ValueText
            placeholder={props.field.placeholder ?? "選択してください"}
          />
          <Select.Indicator>▼</Select.Indicator>
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content
            class={css({
              bg: "white",
              borderWidth: 1,
              borderColor: "gray.200",
              borderRadius: "md",
              shadow: "lg",
              py: 1,
              zIndex: 50,
            })}
          >
            <Select.ItemGroup>
              <Index each={collection().items}>
                {(item) => (
                  <Select.Item
                    item={item()}
                    class={css({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 3,
                      py: 2,
                      cursor: "pointer",
                      _hover: { bg: "gray.100" },
                      _highlighted: { bg: "blue.50" },
                    })}
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
}

function DateInput(props: FieldInputProps & { hasError: boolean }) {
  return (
    <input
      type="date"
      id={props.field.name}
      name={props.field.name}
      value={props.value ? String(props.value).split("T")[0] : ""}
      disabled={props.field.readonly}
      class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
    />
  );
}

function DateTimeInput(props: FieldInputProps & { hasError: boolean }) {
  return (
    <input
      type="datetime-local"
      id={props.field.name}
      name={props.field.name}
      value={props.value ? String(props.value).slice(0, 16) : ""}
      disabled={props.field.readonly}
      class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
    />
  );
}

function EmailInput(props: FieldInputProps & { hasError: boolean }) {
  return (
    <input
      type="email"
      id={props.field.name}
      name={props.field.name}
      value={String(props.value ?? "")}
      placeholder={props.field.placeholder}
      disabled={props.field.readonly}
      class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
    />
  );
}

function UrlInput(props: FieldInputProps & { hasError: boolean }) {
  return (
    <input
      type="url"
      id={props.field.name}
      name={props.field.name}
      value={String(props.value ?? "")}
      placeholder={props.field.placeholder}
      disabled={props.field.readonly}
      class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
    />
  );
}

function PasswordInput(props: FieldInputProps & { hasError: boolean }) {
  return (
    <input
      type="password"
      id={props.field.name}
      name={props.field.name}
      value={String(props.value ?? "")}
      placeholder={props.field.placeholder}
      disabled={props.field.readonly}
      class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
    />
  );
}

function TimeInput(props: FieldInputProps & { hasError: boolean }) {
  return (
    <input
      type="time"
      id={props.field.name}
      name={props.field.name}
      value={String(props.value ?? "")}
      disabled={props.field.readonly}
      class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
    />
  );
}

function TelInput(props: FieldInputProps & { hasError: boolean }) {
  return (
    <input
      type="tel"
      id={props.field.name}
      name={props.field.name}
      value={String(props.value ?? "")}
      placeholder={props.field.placeholder}
      disabled={props.field.readonly}
      class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
      onInput={(e) => props.onChange(props.field.name, e.currentTarget.value)}
    />
  );
}

function FileInput(props: FieldInputProps & { hasError: boolean }) {
  const isImage = () => props.field.kind === "image";

  return (
    <div class={css({ display: "flex", flexDirection: "column", gap: 2 })}>
      <input
        type="file"
        id={props.field.name}
        name={props.field.name}
        accept={isImage() ? "image/*" : undefined}
        disabled={props.field.readonly}
        class={`${inputStyles} ${props.hasError ? errorInputStyles : ""}`}
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          props.onChange(props.field.name, file ?? null);
        }}
      />
      <Show when={isImage() && props.value && typeof props.value === "string"}>
        <img
          src={props.value as string}
          alt=""
          class={css({ maxW: 48, maxH: 48, borderRadius: "md" })}
        />
      </Show>
    </div>
  );
}

function RelationInput(props: FieldInputProps & { hasError: boolean }) {
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
        <Select.Trigger
          class={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            w: "full",
            px: 3,
            py: 2,
            borderWidth: 1,
            borderColor: props.hasError ? "red.500" : "gray.300",
            borderRadius: "md",
            bg: "white",
            cursor: "pointer",
            _disabled: { bg: "gray.100", cursor: "not-allowed" },
          })}
        >
          <Select.ValueText
            placeholder={props.field.placeholder ?? "選択してください"}
          />
          <Select.Indicator>▼</Select.Indicator>
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content
            class={css({
              bg: "white",
              borderWidth: 1,
              borderColor: "gray.200",
              borderRadius: "md",
              shadow: "lg",
              py: 1,
              zIndex: 50,
            })}
          >
            <Select.ItemGroup>
              <Index each={collection().items}>
                {(item) => (
                  <Select.Item
                    item={item()}
                    class={css({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 3,
                      py: 2,
                      cursor: "pointer",
                      _hover: { bg: "gray.100" },
                      _highlighted: { bg: "blue.50" },
                    })}
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
}
