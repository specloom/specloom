import { type Component, For } from "solid-js";
import type { ActionVM } from "specloom";
import { ActionButton } from "../shared/ActionButton.jsx";

export interface FormActionsProps {
  actions: ActionVM[];
  onAction: (actionId: string) => void;
}

export const FormActions: Component<FormActionsProps> = (props) => {
  return (
    <div class="flex gap-2">
      <For each={props.actions}>
        {(action) => (
          <ActionButton action={action} onExecute={props.onAction} />
        )}
      </For>
    </div>
  );
};
