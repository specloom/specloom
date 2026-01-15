import { type Component, For, Show } from "solid-js";
import type { FormFieldVM, FormViewModel, FieldGroup } from "specloom";
import { FormField } from "./FormField.jsx";

export interface FormGroupProps {
  group?: FieldGroup;
  fields: FormFieldVM[];
  vm: FormViewModel;
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
}

export const FormGroup: Component<FormGroupProps> = (props) => {
  return (
    <fieldset class="rounded-lg border border-border p-6">
      <Show when={props.group}>
        <legend class="px-2 text-sm font-semibold text-foreground">
          {props.group!.label}
        </legend>
      </Show>

      <div class="space-y-6">
        <For each={props.fields}>
          {(field) => (
            <FormField
              field={field}
              vm={props.vm}
              value={props.values[field.name]}
              onChange={props.onChange}
            />
          )}
        </For>
      </div>
    </fieldset>
  );
};
