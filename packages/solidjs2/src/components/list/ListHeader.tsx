import { type Component, For, Show } from "solid-js";
import { Checkbox } from "@ark-ui/solid/checkbox";
import type { ListFieldVM } from "specloom";

export interface ListHeaderProps {
  fields: ListFieldVM[];
  selectable?: boolean;
  multiSelect?: boolean;
  allSelected?: boolean;
  onSelectAll?: () => void;
  onSort?: (field: string) => void;
  sortIcon?: (field: string) => string;
}

export const ListHeader: Component<ListHeaderProps> = (props) => {
  return (
    <thead class="[&_tr]:border-b">
      <tr class="border-b border-border transition-colors hover:bg-muted/40">
        <Show when={props.selectable}>
          <th class="h-10 w-10 px-2 text-left align-middle font-medium text-muted-foreground">
            <Show when={props.multiSelect}>
              <Checkbox.Root
                checked={props.allSelected}
                onCheckedChange={() => props.onSelectAll?.()}
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
          </th>
        </Show>

        <For each={props.fields}>
          {(field) => (
            <th
              class={`h-10 px-3 text-left align-middle text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                field.sortable
                  ? "cursor-pointer select-none hover:text-foreground"
                  : ""
              }`}
              onClick={() => field.sortable && props.onSort?.(field.name)}
            >
              <div class="flex items-center gap-1">
                {field.label}
                <Show when={field.sortable}>
                  <span class="text-muted-foreground text-[10px]">
                    {props.sortIcon?.(field.name) ?? "⇅"}
                  </span>
                </Show>
              </div>
            </th>
          )}
        </For>

        <th class="h-10 w-20 px-3 text-right align-middle text-xs font-medium text-muted-foreground uppercase tracking-wider">
          操作
        </th>
      </tr>
    </thead>
  );
};
