import {
  type Component,
  type JSX,
  For,
  Show,
  children as resolveChildren,
} from "solid-js";
import type { ShowFieldVM } from "specloom";
import { useShow } from "./context.jsx";
import { ShowField } from "./ShowField.jsx";
import { ShowGroup } from "./ShowGroup.jsx";

export interface ShowBodyProps {
  class?: string;
  children?:
    | JSX.Element
    | ((field: ShowFieldVM, value: unknown) => JSX.Element);
}

/**
 * ShowBody - 詳細ビューのフィールド部分
 */
export const ShowBody: Component<ShowBodyProps> = (props) => {
  const { loading, fields, groups, vm } = useShow();

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
            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <For each={fields()}>
                {(field) => {
                  const value = vm().value(field.name);
                  return (
                    <Show
                      when={renderField()}
                      fallback={<ShowField field={field} value={value} />}
                    >
                      {renderField()!(field, value)}
                    </Show>
                  );
                }}
              </For>
            </dl>
          }
        >
          <div class="space-y-8">
            <For each={groups()}>
              {(group) => (
                <ShowGroup group={group} renderField={renderField()} />
              )}
            </For>
          </div>
        </Show>
      </div>
    </Show>
  );
};
