import {
  type Component,
  type JSX,
  For,
  Show,
  children as resolveChildren,
} from "solid-js";
import type { FormFieldVM } from "specloom";
import { FormVM } from "specloom";
import { useForm } from "./context.jsx";
import { FormField } from "./FormField.jsx";
import { FormGroup } from "./FormGroup.jsx";

export interface FormBodyProps {
  class?: string;
  children?: JSX.Element | ((field: FormFieldVM) => JSX.Element);
}

/**
 * FormBody - フォームのフィールド部分
 */
export const FormBody: Component<FormBodyProps> = (props) => {
  const { loading, visibleFields, groups, vm, values, onChange } = useForm();

  const hasGroups = () => groups().length > 0;

  const renderField = () => {
    if (typeof props.children === "function") {
      return props.children;
    }
    return undefined;
  };

  return (
    <Show when={!loading()}>
      <div class={props.class ?? "p-6"}>
        <Show
          when={hasGroups()}
          fallback={
            <div class="space-y-6">
              <For each={visibleFields()}>
                {(field) => (
                  <Show
                    when={renderField()}
                    fallback={
                      <FormField
                        field={field}
                        value={values()[field.name]}
                      />
                    }
                  >
                    {renderField()!(field)}
                  </Show>
                )}
              </For>
            </div>
          }
        >
          <div class="space-y-8">
            <For each={groups()}>
              {(group) => (
                <FormGroup
                  group={group}
                  fields={FormVM.fieldsInGroup(vm(), group.id)}
                  renderField={renderField()}
                />
              )}
            </For>
          </div>
        </Show>
      </div>
    </Show>
  );
};
