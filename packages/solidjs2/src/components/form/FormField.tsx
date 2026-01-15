import { type Component, Show, For } from "solid-js";
import type { FormFieldVM, FormViewModel } from "specloom";
import { FormVM } from "specloom";
import { FieldInput } from "../shared/FieldInput.jsx";

export interface FormFieldProps {
  field: FormFieldVM;
  vm: FormViewModel;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}

export const FormField: Component<FormFieldProps> = (props) => {
  const hasError = () => FormVM.hasError(props.vm, props.field.name);
  const errors = () => FormVM.fieldErrors(props.vm, props.field.name);

  return (
    <div class="space-y-2">
      {/* Label */}
      <label
        for={props.field.name}
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
      >
        {props.field.label}
        <Show when={props.field.required}>
          <span class="ml-0.5 text-destructive">*</span>
        </Show>
      </label>

      {/* Input */}
      <FieldInput
        field={props.field}
        value={props.value}
        onChange={props.onChange}
      />

      {/* Hint */}
      <Show when={props.field.hint}>
        <p class="text-[0.8rem] text-muted-foreground">{props.field.hint}</p>
      </Show>

      {/* Errors */}
      <Show when={hasError()}>
        <For each={errors()}>
          {(error) => (
            <p class="text-[0.8rem] font-medium text-destructive">{error}</p>
          )}
        </For>
      </Show>
    </div>
  );
};
