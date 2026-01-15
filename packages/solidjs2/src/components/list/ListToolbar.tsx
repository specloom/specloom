import { type Component, For, Show } from "solid-js";
import type { ActionVM } from "specloom";
import { ActionButton } from "../shared/ActionButton.jsx";

export interface ListToolbarProps {
  headerActions?: ActionVM[];
  bulkActions?: ActionVM[];
  selectedCount?: number;
  selectedIds?: string[];
  onAction?: (actionId: string, rowIds?: string[]) => void;
}

export const ListToolbar: Component<ListToolbarProps> = (props) => {
  return (
    <>
      {/* Header Actions */}
      <Show when={(props.headerActions?.length ?? 0) > 0}>
        <div class="flex items-center justify-between border-b border-border p-4">
          <div class="flex items-center gap-2">
            <For each={props.headerActions}>
              {(action) => (
                <ActionButton
                  action={action}
                  onExecute={(id) => props.onAction?.(id)}
                />
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Bulk Actions */}
      <Show when={(props.selectedCount ?? 0) > 0}>
        <div class="flex items-center gap-4 border-b border-border bg-muted/40 px-4 py-3">
          <span class="text-sm font-medium text-foreground">
            {props.selectedCount} 件選択中
          </span>
          <div class="flex items-center gap-2">
            <For each={props.bulkActions}>
              {(action) => (
                <ActionButton
                  action={action}
                  onExecute={(id) => props.onAction?.(id, props.selectedIds)}
                  size="sm"
                />
              )}
            </For>
          </div>
        </div>
      </Show>
    </>
  );
};
