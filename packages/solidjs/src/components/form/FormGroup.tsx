import { type Component, type JSX, For, Show } from "solid-js";
import type { FormFieldVM, FieldGroup } from "specloom";
import { useForm } from "./context.jsx";
import { FormField } from "./FormField.jsx";

export interface FormGroupProps {
  group?: FieldGroup;
  fields: FormFieldVM[];
  renderField?: (field: FormFieldVM) => JSX.Element;
  class?: string;
}

/**
 * FormGroup - フィールドのグループ
 */
export const FormGroup: Component<FormGroupProps> = (props) => {
  const { values } = useForm();

  return (
    <fieldset class={props.class ?? "rounded-lg border border-border p-6"}>
      <Show when={props.group}>
        <legend class="px-2 text-sm font-semibold text-foreground">
          {props.group!.label}
        </legend>
      </Show>

      <div class="space-y-6">
        <For each={props.fields}>
          {(field) => (
            <Show
              when={props.renderField}
              fallback={
                <FormField field={field} value={values()[field.name]} />
              }
            >
              {props.renderField!(field)}
            </Show>
          )}
        </For>
      </div>
    </fieldset>
  );
};
