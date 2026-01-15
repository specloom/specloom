import { For } from "solid-js";
import type { ShowViewModel } from "specloom";
import { FieldRenderer } from "./FieldRenderer.tsx";
import { ActionButton } from "./ActionButton.tsx";

// ============================================================
// Types
// ============================================================

export interface ShowViewProps {
  vm: ShowViewModel;
  onAction: (actionId: string) => void;
}

// ============================================================
// ShowView Component
// ============================================================

export function ShowView(props: ShowViewProps) {
  return (
    <div data-component="show-view">
      {/* Header */}
      <header>
        <h1>{props.vm.label}</h1>

        {/* Actions */}
        <div data-slot="actions">
          <For each={props.vm.actions}>
            {(action) => (
              <ActionButton action={action} onExecute={props.onAction} />
            )}
          </For>
        </div>
      </header>

      {/* Fields */}
      <dl data-slot="fields">
        <For each={props.vm.fields}>
          {(field) => (
            <div data-slot="field-row">
              <FieldRenderer field={field} mode="display" />
            </div>
          )}
        </For>
      </dl>
    </div>
  );
}
