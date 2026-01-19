import {
  type Component,
  type JSX,
  For,
  Show,
  children as resolveChildren,
} from "solid-js";
import { useForm } from "./context.jsx";
import { ActionButton } from "../shared/ActionButton.jsx";

export interface FormActionsProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * FormActions - フォームのアクションボタン群
 */
export const FormActions: Component<FormActionsProps> = (props) => {
  const { allowedActions, onAction } = useForm();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <Show when={onAction}>
      <div class={props.class ?? "flex gap-2"}>
        <Show
          when={hasChildren()}
          fallback={
            <For each={allowedActions()}>
              {(action) => (
                <ActionButton action={action} onExecute={onAction!} />
              )}
            </For>
          }
        >
          {resolved()}
        </Show>
      </div>
    </Show>
  );
};
