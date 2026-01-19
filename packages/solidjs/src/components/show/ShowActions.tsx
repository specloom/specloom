import { type Component, For } from "solid-js";
import { useShow } from "./context.jsx";
import { ActionButton } from "../shared/ActionButton.jsx";

export interface ShowActionsProps {
  class?: string;
}

/**
 * ShowActions - 詳細ビューのアクションボタン群
 */
export const ShowActions: Component<ShowActionsProps> = (props) => {
  const { allowedActions, onAction } = useShow();

  return (
    <div class={props.class ?? "flex items-center gap-2"}>
      <For each={allowedActions()}>
        {(action) => <ActionButton action={action} onExecute={onAction!} />}
      </For>
    </div>
  );
};
