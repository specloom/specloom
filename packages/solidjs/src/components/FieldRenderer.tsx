import { Match, Switch, For, Show } from "solid-js";
import { Select, createListCollection } from "@ark-ui/solid/select";
import { NumberInput } from "@ark-ui/solid/number-input";
import { Switch as SwitchInput } from "@ark-ui/solid/switch";
import { styled } from "../../styled-system/jsx";
import { css } from "../../styled-system/css";
import { input } from "../../styled-system/recipes";
import { textarea } from "../../styled-system/recipes";
import { select } from "../../styled-system/recipes";
import { numberInput } from "../../styled-system/recipes";
import { switchRecipe } from "../../styled-system/recipes";
import { formLabel } from "../../styled-system/recipes";
import type { FormFieldVM, ShowFieldVM } from "specloom";

// ============================================================
// Styled Components
// ============================================================

const StyledInput = styled("input", input);
const StyledTextarea = styled("textarea", textarea);
const StyledLabel = styled("label", formLabel);

// ============================================================
// Types
// ============================================================

export interface FieldRendererProps {
  field: FormFieldVM | ShowFieldVM;
  mode: "display" | "input";
  onChange?: (value: unknown) => void;
}

// Type guard for FormFieldVM
function isFormField(field: FormFieldVM | ShowFieldVM): field is FormFieldVM {
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
    <div
      class={css({
        display: "flex",
        flexDirection: "column",
        gap: "1.5",
      })}
      data-invalid={hasErrors() || undefined}
    >
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
            hasErrors={hasErrors()}
          />
        </Match>
      </Switch>

      {/* Error Messages */}
      <Show when={isFormField(props.field) && props.field.errors.length > 0}>
        <For each={(props.field as FormFieldVM).errors}>
          {(error) => (
            <span class={css({ color: "fg.error", fontSize: "sm" })}>
              {error}
            </span>
          )}
        </For>
      </Show>
    </div>
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
    <>
      <StyledLabel size="sm">{props.field.label}</StyledLabel>
      <div
        class={css({
          py: "2",
          px: "3",
          bg: "bg.muted",
          borderRadius: "md",
          minHeight: "40px",
          display: "flex",
          alignItems: "center",
        })}
      >
        <Switch fallback={<span>{String(props.field.value ?? "-")}</span>}>
          <Match when={props.field.kind === "boolean"}>
            <span>{props.field.value ? "Yes" : "No"}</span>
          </Match>

          <Match
            when={props.field.kind === "enum" || props.field.kind === "status"}
          >
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
    </>
  );
}

// ============================================================
// Input Field (for FormView)
// ============================================================

interface InputFieldProps {
  field: FormFieldVM;
  onChange?: (value: unknown) => void;
  hasErrors: boolean;
}

function InputField(props: InputFieldProps) {
  return (
    <Switch
      fallback={
        <TextInput
          field={props.field}
          onChange={props.onChange}
          hasErrors={props.hasErrors}
        />
      }
    >
      {/* Text variants */}
      <Match
        when={
          props.field.kind === "text" ||
          props.field.kind === "email" ||
          props.field.kind === "url" ||
          props.field.kind === "tel"
        }
      >
        <TextInput
          field={props.field}
          onChange={props.onChange}
          hasErrors={props.hasErrors}
        />
      </Match>

      {/* Password */}
      <Match when={props.field.kind === "password"}>
        <PasswordInput
          field={props.field}
          onChange={props.onChange}
          hasErrors={props.hasErrors}
        />
      </Match>

      {/* Long text */}
      <Match when={props.field.kind === "longText"}>
        <TextareaInput
          field={props.field}
          onChange={props.onChange}
          hasErrors={props.hasErrors}
        />
      </Match>

      {/* Number variants */}
      <Match
        when={
          props.field.kind === "number" ||
          props.field.kind === "currency" ||
          props.field.kind === "percent"
        }
      >
        <NumberInputField field={props.field} onChange={props.onChange} />
      </Match>

      {/* Boolean */}
      <Match when={props.field.kind === "boolean"}>
        <BooleanInput field={props.field} onChange={props.onChange} />
      </Match>

      {/* Enum / Status */}
      <Match
        when={props.field.kind === "enum" || props.field.kind === "status"}
      >
        <SelectInput field={props.field} onChange={props.onChange} />
      </Match>

      {/* Relation */}
      <Match when={props.field.kind === "relation"}>
        <RelationInput
          field={props.field}
          onChange={props.onChange}
          hasErrors={props.hasErrors}
        />
      </Match>
    </Switch>
  );
}

// ============================================================
// Input Components
// ============================================================

interface BaseInputProps {
  field: FormFieldVM;
  onChange?: (value: unknown) => void;
  hasErrors: boolean;
}

function FieldLabel(props: { label: string; required?: boolean }) {
  return (
    <StyledLabel size="sm">
      {props.label}
      <Show when={props.required}>
        <span class={css({ color: "fg.error", ml: "0.5" })}>*</span>
      </Show>
    </StyledLabel>
  );
}

function TextInput(props: BaseInputProps) {
  const inputType = () => {
    switch (props.field.kind) {
      case "email":
        return "email";
      case "url":
        return "url";
      case "tel":
        return "tel";
      default:
        return "text";
    }
  };

  return (
    <>
      <FieldLabel label={props.field.label} required={props.field.required} />
      <StyledInput
        type={inputType()}
        value={String(props.field.value ?? "")}
        required={props.field.required}
        readOnly={props.field.readonly}
        onInput={(e) => props.onChange?.(e.currentTarget.value)}
        size="md"
        class={css({
          bg: props.field.readonly ? "bg.muted" : "bg.default",
          borderColor: props.hasErrors ? "border.error" : undefined,
          _focus: {
            borderColor: props.hasErrors ? "border.error" : "accent.default",
            boxShadow: props.hasErrors
              ? "0 0 0 1px var(--colors-border-error)"
              : undefined,
          },
        })}
      />
    </>
  );
}

function PasswordInput(props: BaseInputProps) {
  return (
    <>
      <FieldLabel label={props.field.label} required={props.field.required} />
      <StyledInput
        type="password"
        value={String(props.field.value ?? "")}
        required={props.field.required}
        readOnly={props.field.readonly}
        onInput={(e) => props.onChange?.(e.currentTarget.value)}
        size="md"
        class={css({
          bg: props.field.readonly ? "bg.muted" : "bg.default",
          borderColor: props.hasErrors ? "border.error" : undefined,
        })}
      />
    </>
  );
}

function TextareaInput(props: BaseInputProps) {
  return (
    <>
      <FieldLabel label={props.field.label} required={props.field.required} />
      <StyledTextarea
        value={String(props.field.value ?? "")}
        required={props.field.required}
        readOnly={props.field.readonly}
        onInput={(e) => props.onChange?.(e.currentTarget.value)}
        rows={4}
        class={css({
          bg: props.field.readonly ? "bg.muted" : "bg.default",
          borderColor: props.hasErrors ? "border.error" : undefined,
        })}
      />
    </>
  );
}

interface NumberInputProps {
  field: FormFieldVM;
  onChange?: (value: unknown) => void;
}

function NumberInputField(props: NumberInputProps) {
  const styles = numberInput();

  return (
    <NumberInput.Root
      class={styles.root}
      value={String(props.field.value ?? "")}
      disabled={props.field.readonly}
      min={props.field.validation?.min}
      max={props.field.validation?.max}
      onValueChange={(details) => props.onChange?.(details.valueAsNumber)}
    >
      <NumberInput.Label
        class={css({
          fontSize: "sm",
          fontWeight: "medium",
          color: "fg.default",
        })}
      >
        {props.field.label}
        <Show when={props.field.required}>
          <span class={css({ color: "fg.error", ml: "0.5" })}>*</span>
        </Show>
      </NumberInput.Label>
      <div class={css({ display: "flex", mt: "1.5" })}>
        <NumberInput.Input
          class={css({
            flex: "1",
            h: "10",
            px: "3",
            borderWidth: "1px",
            borderColor: "border.default",
            borderRadius: "l2",
            bg: props.field.readonly ? "bg.muted" : "bg.default",
            _focus: {
              borderColor: "accent.default",
              outline: "none",
            },
          })}
        />
        <NumberInput.Control
          class={css({ display: "flex", flexDirection: "column", ml: "-1px" })}
        >
          <NumberInput.IncrementTrigger
            class={css({
              h: "5",
              w: "8",
              borderWidth: "1px",
              borderColor: "border.default",
              borderTopRightRadius: "l2",
              bg: "bg.default",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "xs",
              _hover: { bg: "bg.muted" },
            })}
          >
            ▲
          </NumberInput.IncrementTrigger>
          <NumberInput.DecrementTrigger
            class={css({
              h: "5",
              w: "8",
              borderWidth: "1px",
              borderColor: "border.default",
              borderBottomRightRadius: "l2",
              mt: "-1px",
              bg: "bg.default",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "xs",
              _hover: { bg: "bg.muted" },
            })}
          >
            ▼
          </NumberInput.DecrementTrigger>
        </NumberInput.Control>
      </div>
    </NumberInput.Root>
  );
}

function BooleanInput(props: NumberInputProps) {
  const styles = switchRecipe();

  return (
    <SwitchInput.Root
      class={css({ display: "flex", alignItems: "center", gap: "3" })}
      checked={Boolean(props.field.value)}
      disabled={props.field.readonly}
      onCheckedChange={(details) => props.onChange?.(details.checked)}
    >
      <SwitchInput.Control
        class={css({
          display: "inline-flex",
          alignItems: "center",
          w: "11",
          h: "6",
          borderRadius: "full",
          bg: "bg.emphasized",
          cursor: "pointer",
          transition: "background 0.2s",
          _checked: { bg: "accent.default" },
          _disabled: { opacity: 0.5, cursor: "not-allowed" },
        })}
      >
        <SwitchInput.Thumb
          class={css({
            w: "5",
            h: "5",
            borderRadius: "full",
            bg: "white",
            boxShadow: "sm",
            transition: "transform 0.2s",
            transform: "translateX(2px)",
            _checked: { transform: "translateX(22px)" },
          })}
        />
      </SwitchInput.Control>
      <SwitchInput.Label class={css({ fontSize: "sm", fontWeight: "medium" })}>
        {props.field.label}
      </SwitchInput.Label>
      <SwitchInput.HiddenInput />
    </SwitchInput.Root>
  );
}

function SelectInput(props: NumberInputProps) {
  const styles = select();

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
      <Select.Label
        class={css({
          fontSize: "sm",
          fontWeight: "medium",
          color: "fg.default",
        })}
      >
        {props.field.label}
        <Show when={props.field.required}>
          <span class={css({ color: "fg.error", ml: "0.5" })}>*</span>
        </Show>
      </Select.Label>
      <Select.Control class={css({ mt: "1.5" })}>
        <Select.Trigger
          class={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            w: "full",
            h: "10",
            px: "3",
            borderWidth: "1px",
            borderColor: "border.default",
            borderRadius: "l2",
            bg: props.field.readonly ? "bg.muted" : "bg.default",
            cursor: props.field.readonly ? "not-allowed" : "pointer",
            _hover: { borderColor: "border.hover" },
            _focus: { borderColor: "accent.default", outline: "none" },
          })}
        >
          <Select.ValueText
            placeholder="選択してください"
            class={css({ color: "fg.default" })}
          />
          <Select.Indicator class={css({ color: "fg.muted", fontSize: "xs" })}>
            ▼
          </Select.Indicator>
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content
          class={css({
            bg: "bg.default",
            borderWidth: "1px",
            borderColor: "border.default",
            borderRadius: "l2",
            boxShadow: "lg",
            py: "1",
            zIndex: "dropdown",
            minW: "var(--reference-width)",
          })}
        >
          <For each={props.field.options}>
            {(option) => (
              <Select.Item
                item={option}
                class={css({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: "3",
                  py: "2",
                  cursor: "pointer",
                  _hover: { bg: "bg.muted" },
                  _highlighted: { bg: "bg.muted" },
                  _selected: { bg: "accent.a3" },
                })}
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator class={css({ color: "accent.default" })}>
                  ✓
                </Select.ItemIndicator>
              </Select.Item>
            )}
          </For>
        </Select.Content>
      </Select.Positioner>
      <Select.HiddenSelect />
    </Select.Root>
  );
}

function RelationInput(props: BaseInputProps) {
  const displayValue = () => {
    const val = props.field.value as Record<string, unknown> | null;
    if (!val) return "";
    const labelField = props.field.relation?.labelField ?? "name";
    return String(val[labelField] ?? val.id ?? "");
  };

  return (
    <>
      <FieldLabel label={props.field.label} required={props.field.required} />
      <StyledInput
        type="text"
        value={displayValue()}
        readOnly
        placeholder="リレーション（未実装）"
        size="md"
        class={css({ bg: "bg.muted" })}
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
