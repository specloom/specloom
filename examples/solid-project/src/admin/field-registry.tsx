import { Dynamic } from "solid-js/web"
import { For, Show, type Component } from "solid-js"

import { TextField, TextFieldInput, TextFieldTextArea, TextFieldLabel, TextFieldErrorMessage } from "~/components/ui/text-field"
import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldLabel } from "~/components/ui/number-field"
import { Switch, SwitchControl, SwitchThumb, SwitchLabel } from "~/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"
import { Badge } from "~/components/ui/badge"
import { Label } from "~/components/ui/label"

export interface FieldRendererProps {
  name: string
  label: string
  value: unknown
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
    <TextFieldLabel>{props.label}</TextFieldLabel>
    <TextFieldInput placeholder={props.placeholder} />
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
    <TextFieldLabel>{props.label}</TextFieldLabel>
    <TextFieldInput type="password" placeholder={props.placeholder} />
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
    <TextFieldLabel>{props.label}</TextFieldLabel>
    <TextFieldTextArea placeholder={props.placeholder} />
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
    <NumberFieldLabel>{props.label}</NumberFieldLabel>
    <NumberFieldGroup>
      <NumberFieldInput />
    </NumberFieldGroup>
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
    <SwitchLabel>{props.label}</SwitchLabel>
  </Switch>
)

const SelectField: Component<FieldRendererProps> = (props) => {
  const options = () => props.options ?? []
  const selectedOption = () => options().find((o) => String(o.value) === String(props.value))

  return (
    <div class="flex flex-col gap-1">
      <Label>{props.label}</Label>
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
        <SelectTrigger>
          <SelectValue<{ value: unknown; label: string }>>
            {(state) => state.selectedOption()?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent />
      </Select>
      <Show when={props.errors?.length}>
        <For each={props.errors}>
          {(err) => <p class="text-xs text-error-foreground">{err}</p>}
        </For>
      </Show>
    </div>
  )
}

const ColorField: Component<FieldRendererProps> = (props) => (
  <div class="flex flex-col gap-1">
    <Label>{props.label}</Label>
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
    <Label class="text-muted-foreground">{props.label}</Label>
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
  "date-range": TextInputField,
  "multi-combobox": TextInputField,
}

export function resolveFieldComponent(widget?: string, readonly?: boolean): Component<FieldRendererProps> {
  if (readonly) return ReadonlyField
  if (!widget) return TextInputField
  return widgetMap[widget] ?? TextInputField
}

export const FieldRenderer: Component<FieldRendererProps> = (props) => {
  const Comp = () => resolveFieldComponent(props.widget, props.readonly)
  return <Dynamic component={Comp()} {...props} />
}
