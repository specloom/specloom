import { type Component, type JSX, For, Show } from "solid-js";
import type { ShowFieldVM, FieldGroup } from "specloom";
import { ShowVM } from "specloom";
import { useShow } from "./context.jsx";
import { ShowField } from "./ShowField.jsx";

export interface ShowGroupProps {
  group: FieldGroup;
  renderField?: (field: ShowFieldVM, value: unknown) => JSX.Element;
  class?: string;
}

/**
 * ShowGroup - 詳細ビューのフィールドグループ
 */
export const ShowGroup: Component<ShowGroupProps> = (props) => {
  const { vm } = useShow();

  const fields = () => ShowVM.fieldsInGroup(vm(), props.group.id);

  return (
    <div class={props.class ?? "rounded-lg border border-border p-4"}>
      <Show when={props.group.label}>
        <h3 class="mb-4 text-lg font-semibold text-foreground">
          {props.group.label}
        </h3>
      </Show>

      <dl class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <For each={fields()}>
          {(field) => {
            const value = ShowVM.value(vm(), field.name);
            return (
              <Show
                when={props.renderField}
                fallback={<ShowField field={field} value={value} />}
              >
                {props.renderField!(field, value)}
              </Show>
            );
          }}
        </For>
      </dl>
    </div>
  );
};
