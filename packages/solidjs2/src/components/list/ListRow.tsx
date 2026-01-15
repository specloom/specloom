import { type Component, For, Show } from "solid-js";
import { Checkbox } from "@ark-ui/solid/checkbox";
import type { ListFieldVM, RowVM } from "specloom";
import { ListVM } from "specloom";
import { FieldDisplay } from "../shared/FieldDisplay.jsx";
import { ActionButton } from "../shared/ActionButton.jsx";

export interface ListRowProps {
  row: RowVM;
  fields: ListFieldVM[];
  selectable?: boolean;
  multiSelect?: boolean;
  selected?: boolean;
  clickable?: boolean;
  onSelect?: (rowId: string) => void;
  onClick?: (rowId: string) => void;
  onAction?: (actionId: string, rowIds: string[]) => void;
}

export const ListRow: Component<ListRowProps> = (props) => {
  return (
    <tr
      class={`border-b border-border transition-colors hover:bg-muted/40 ${
        props.selected ? "bg-muted/60" : ""
      } ${props.clickable ? "cursor-pointer" : ""}`}
      onClick={() => props.onClick?.(props.row.id)}
    >
      <Show when={props.selectable}>
        <td class="p-2 align-middle" onClick={(e) => e.stopPropagation()}>
          <Show
            when={props.multiSelect}
            fallback={
              <div class="flex items-center justify-center">
                <input
                  type="radio"
                  checked={props.selected}
                  onChange={() => props.onSelect?.(props.row.id)}
                  class="h-4 w-4 border-input text-primary focus:ring-ring"
                />
              </div>
            }
          >
            <Checkbox.Root
              checked={props.selected}
              onCheckedChange={() => props.onSelect?.(props.row.id)}
              class="peer inline-flex items-center justify-center"
            >
              <Checkbox.Control class="peer h-4 w-4 shrink-0 rounded-sm border border-input shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary">
                <Checkbox.Indicator class="flex items-center justify-center text-current">
                  <svg
                    class="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.HiddenInput />
            </Checkbox.Root>
          </Show>
        </td>
      </Show>

      <For each={props.fields}>
        {(field) => (
          <td class="p-3 align-middle text-sm text-foreground">
            <FieldDisplay
              field={field}
              value={ListVM.cellValue(props.row, field.name)}
            />
          </td>
        )}
      </For>

      <td
        class="p-3 align-middle text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div class="flex items-center justify-end gap-1">
          <For each={ListVM.rowActions(props.row)}>
            {(action) => (
              <ActionButton
                action={action}
                onExecute={(id) => props.onAction?.(id, [props.row.id])}
                size="sm"
              />
            )}
          </For>
        </div>
      </td>
    </tr>
  );
};
