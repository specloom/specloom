import type { CompiledFieldType } from "@specloom/spec"
import { Dynamic } from "solid-js/web"
import { For, Show, type Component } from "solid-js"

import { TextField, TextFieldInput, TextFieldTextArea, TextFieldLabel, TextFieldErrorMessage } from "~/components/ui/text-field"
import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldLabel } from "~/components/ui/number-field"
import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Label } from "~/components/ui/label"

export interface FieldRendererProps {
  name: string
  label: string
  value: unknown
  fieldType?: CompiledFieldType
  widget?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  errors?: string[]
  placeholder?: string
  help?: string
  options?: Array<{ value: unknown; label: string }>
  onChange?: (value: unknown) => void
}

const TextInputField: Component<FieldRendererProps> = (props) => (
  <TextField
    value={String(props.value ?? "")}
    onChange={(v: string) => props.onChange?.(v)}
    disabled={props.disabled}
    readOnly={props.readonly}
  >
    <TextFieldLabel class={props.errors?.length ? "text-destructive" : undefined}>
      {renderLabel(props.label, props.required)}
    </TextFieldLabel>
    <TextFieldInput
      placeholder={props.placeholder}
      class={props.errors?.length ? "border-error-foreground text-error-foreground" : undefined}
    />
    <Show when={props.help}>
      <p class="text-xs text-muted-foreground">{props.help}</p>
    </Show>
    <Show when={props.errors?.length}>
      <For each={props.errors}>
        {(err) => <TextFieldErrorMessage>{err}</TextFieldErrorMessage>}
      </For>
    </Show>
  </TextField>
)

const PasswordField: Component<FieldRendererProps> = (props) => (
  <TextField
    value={String(props.value ?? "")}
    onChange={(v: string) => props.onChange?.(v)}
    disabled={props.disabled}
    readOnly={props.readonly}
  >
    <TextFieldLabel class={props.errors?.length ? "text-destructive" : undefined}>
      {renderLabel(props.label, props.required)}
    </TextFieldLabel>
    <TextFieldInput
      type="password"
      placeholder={props.placeholder}
      class={props.errors?.length ? "border-error-foreground text-error-foreground" : undefined}
    />
    <Show when={props.errors?.length}>
      <For each={props.errors}>
        {(err) => <TextFieldErrorMessage>{err}</TextFieldErrorMessage>}
      </For>
    </Show>
  </TextField>
)

const TextAreaField: Component<FieldRendererProps> = (props) => (
  <TextField
    value={String(props.value ?? "")}
    onChange={(v: string) => props.onChange?.(v)}
    disabled={props.disabled}
    readOnly={props.readonly}
  >
    <TextFieldLabel class={props.errors?.length ? "text-destructive" : undefined}>
      {renderLabel(props.label, props.required)}
    </TextFieldLabel>
    <TextFieldTextArea
      placeholder={props.placeholder}
      class={props.errors?.length ? "border-error-foreground text-error-foreground" : undefined}
    />
    <Show when={props.errors?.length}>
      <For each={props.errors}>
        {(err) => <TextFieldErrorMessage>{err}</TextFieldErrorMessage>}
      </For>
    </Show>
  </TextField>
)

const NumberInputField: Component<FieldRendererProps> = (props) => (
  <NumberField
    rawValue={Number(props.value ?? 0)}
    onRawValueChange={(v: number) => props.onChange?.(v)}
    disabled={props.disabled}
    readOnly={props.readonly}
  >
    <NumberFieldLabel class={props.errors?.length ? "text-destructive" : undefined}>
      {renderLabel(props.label, props.required)}
    </NumberFieldLabel>
    <NumberFieldGroup>
      <NumberFieldInput
        class={props.errors?.length ? "border-error-foreground text-error-foreground" : undefined}
      />
    </NumberFieldGroup>
    <Show when={props.help}>
      <p class="text-xs text-muted-foreground">{props.help}</p>
    </Show>
    <Show when={props.errors?.length}>
      <For each={props.errors}>
        {(err) => <p class="text-xs text-error-foreground">{err}</p>}
      </For>
    </Show>
  </NumberField>
)

const SwitchField: Component<FieldRendererProps> = (props) => (
  <Switch
    checked={Boolean(props.value)}
    onChange={(v: boolean) => props.onChange?.(v)}
    disabled={props.disabled}
  >
    <SwitchControl>
      <SwitchThumb />
    </SwitchControl>
    <SwitchLabel>{renderLabel(props.label, props.required)}</SwitchLabel>
  </Switch>
)

const SelectField: Component<FieldRendererProps> = (props) => {
  const options = () => props.options ?? []
  const selectedOption = () => options().find((o) => String(o.value) === String(props.value))

  return (
    <div class="flex flex-col gap-1">
      <Label class={props.errors?.length ? "text-destructive" : undefined}>
        {renderLabel(props.label, props.required)}
      </Label>
      <Select<{ value: unknown; label: string }>
        options={options()}
        optionValue="value"
        optionTextValue="label"
        value={selectedOption()}
        onChange={(opt) => props.onChange?.(opt?.value)}
        disabled={props.disabled}
        placeholder={props.placeholder ?? "Select..."}
        itemComponent={(itemProps) => (
          <SelectItem item={itemProps.item}>
            {(itemProps.item as unknown as { rawValue: { label: string } }).rawValue.label}
          </SelectItem>
        )}
      >
        <SelectTrigger
          class={props.errors?.length ? "border-error-foreground text-error-foreground" : undefined}
        >
          <SelectValue<{ value: unknown; label: string }>>
            {(state) => state.selectedOption()?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
      <Show when={props.help}>
        <p class="text-xs text-muted-foreground">{props.help}</p>
      </Show>
      <Show when={props.errors?.length}>
        <For each={props.errors}>
          {(err) => <p class="text-xs text-error-foreground">{err}</p>}
        </For>
      </Show>
    </div>
  )
}

const DateTimeField: Component<FieldRendererProps> = (props) => (
  <TextField
    value={toDateTimeLocalValue(props.value)}
    onChange={(v: string) => props.onChange?.(toDateTimeValue(v))}
    disabled={props.disabled}
    readOnly={props.readonly}
  >
    <TextFieldLabel class={props.errors?.length ? "text-destructive" : undefined}>
      {renderLabel(props.label, props.required)}
    </TextFieldLabel>
    <TextFieldInput
      type="datetime-local"
      class={props.errors?.length ? "border-error-foreground text-error-foreground" : undefined}
    />
    <Show when={props.help}>
      <p class="text-xs text-muted-foreground">{props.help}</p>
    </Show>
    <Show when={props.errors?.length}>
      <For each={props.errors}>
        {(err) => <TextFieldErrorMessage>{err}</TextFieldErrorMessage>}
      </For>
    </Show>
  </TextField>
)

const ArrayTextField: Component<FieldRendererProps> = (props) => (
  <TextField
    value={toArrayText(props.value)}
    onChange={(v: string) => props.onChange?.(parseArrayText(v))}
    disabled={props.disabled}
    readOnly={props.readonly}
  >
    <TextFieldLabel class={props.errors?.length ? "text-destructive" : undefined}>
      {renderLabel(props.label, props.required)}
    </TextFieldLabel>
    <TextFieldTextArea
      placeholder={props.placeholder ?? "One value per line or comma-separated"}
      class={props.errors?.length ? "border-error-foreground text-error-foreground" : undefined}
    />
    <Show when={props.help}>
      <p class="text-xs text-muted-foreground">{props.help}</p>
    </Show>
    <Show when={!props.help}>
      <p class="text-xs text-muted-foreground">One value per line or comma-separated</p>
    </Show>
    <Show when={props.errors?.length}>
      <For each={props.errors}>
        {(err) => <TextFieldErrorMessage>{err}</TextFieldErrorMessage>}
      </For>
    </Show>
  </TextField>
)

const ColorField: Component<FieldRendererProps> = (props) => (
  <div class="flex flex-col gap-1">
    <Label>{renderLabel(props.label, props.required)}</Label>
    <input
      type="color"
      value={String(props.value ?? "#000000")}
      onInput={(e) => props.onChange?.(e.currentTarget.value)}
      disabled={props.disabled}
      class="h-10 w-20 cursor-pointer rounded border border-input"
    />
  </div>
)

const ReadonlyField: Component<FieldRendererProps> = (props) => (
  <div class="flex flex-col gap-1">
    <Label class="text-muted-foreground">{renderLabel(props.label, props.required)}</Label>
    <span class="text-sm">{formatDisplayValue(props.value)}</span>
  </div>
)

function formatDisplayValue(value: unknown): string {
  if (value == null) return "-"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (value instanceof Date) return value.toLocaleDateString()
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString()
  }
  if (Array.isArray(value)) return value.map(formatDisplayValue).join(", ")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

const widgetMap: Record<string, Component<FieldRendererProps>> = {
  "text": TextInputField,
  "text-input": TextInputField,
  "slug-input": TextInputField,
  "number-input": NumberInputField,
  "textarea": TextAreaField,
  "switch": SwitchField,
  "select": SelectField,
  "badge-select": SelectField,
  "password-input": PasswordField,
  "color-input": ColorField,
  "datetime": DateTimeField,
  "date-range": TextInputField,
  "multi-combobox": TextInputField,
}

export function resolveFieldComponent(props: Pick<FieldRendererProps, "fieldType" | "options" | "readonly" | "widget">): Component<FieldRendererProps> {
  if (props.readonly) return ReadonlyField
  if (shouldUseSelect(props)) return SelectField
  if (shouldUseArrayText(props)) return ArrayTextField
  if (!props.widget) return TextInputField
  return widgetMap[props.widget] ?? TextInputField
}

export const FieldRenderer: Component<FieldRendererProps> = (props) => {
  const Comp = () => resolveFieldComponent(props)
  return <Dynamic component={Comp()} {...props} />
}

function shouldUseArrayText(
  props: Pick<FieldRendererProps, "fieldType" | "widget">,
) {
  if (!props.fieldType || !("array" in props.fieldType) || !props.fieldType.array) {
    return false
  }

  return props.widget === undefined || props.widget === "text" || props.widget === "textarea"
}

function shouldUseSelect(
  props: Pick<FieldRendererProps, "fieldType" | "options" | "widget">,
) {
  if (!props.options?.length) {
    return false
  }

  if (props.fieldType && "array" in props.fieldType && props.fieldType.array) {
    return false
  }

  return props.widget === undefined || props.widget === "text" || props.widget === "select" || props.widget === "badge-select"
}

function renderLabel(label: string, required?: boolean) {
  return (
    <>
      {label}
      <Show when={required}>
        <span class="ml-1 text-destructive">*</span>
      </Show>
    </>
  )
}

function toDateTimeLocalValue(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const pad = (input: number) => String(input).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toDateTimeValue(value: string) {
  if (value === "") {
    return ""
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toISOString()
}

function toArrayText(value: unknown) {
  if (!Array.isArray(value)) {
    return String(value ?? "")
  }

  return value.map((item) => String(item)).join("\n")
}

function parseArrayText(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}
