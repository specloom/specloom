import { type Component, For, Show } from "solid-js";
import type { ListViewModel } from "specloom";
import { ListVM } from "specloom";
import { ListHeader } from "./ListHeader.jsx";
import { ListRow } from "./ListRow.jsx";
import { ListPagination } from "./ListPagination.jsx";
import { ListToolbar } from "./ListToolbar.jsx";
import { cardClasses } from "../ui/index.js";

export interface ListProps {
  vm: ListViewModel;
  onSort?: (field: string) => void;
  onSelect?: (rowId: string) => void;
  onSelectAll?: () => void;
  onAction?: (actionId: string, rowIds?: string[]) => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (rowId: string) => void;
  class?: string;
}

export const List: Component<ListProps> = (props) => {
  const fields = () => ListVM.fields(props.vm);
  const rows = () => ListVM.rows(props.vm);

  return (
    <div
      class={cardClasses(props.class)}
    >
      <ListToolbar
        headerActions={ListVM.headerActions(props.vm)}
        bulkActions={ListVM.bulkActions(props.vm)}
        selectedCount={ListVM.selectedCount(props.vm)}
        selectedIds={ListVM.selectedIds(props.vm)}
        onAction={props.onAction}
      />

      {/* Loading */}
      <Show when={ListVM.loading(props.vm)}>
        <div class="flex items-center justify-center py-12">
          <div class="flex items-center gap-2 text-muted-foreground">
            <svg
              class="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
            </svg>
            <span class="text-sm">読み込み中...</span>
          </div>
        </div>
      </Show>

      {/* Error */}
      <Show when={ListVM.error(props.vm)}>
        <div class="m-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <div class="flex items-center gap-2">
            <svg
              class="h-5 w-5 text-destructive"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p class="text-sm font-medium text-destructive">
              {ListVM.error(props.vm)}
            </p>
          </div>
        </div>
      </Show>

      {/* Table */}
      <Show when={!ListVM.loading(props.vm)}>
        <div class="overflow-x-auto">
          <table class="w-full caption-bottom text-sm">
            <ListHeader
              fields={fields()}
              selectable={ListVM.selectable(props.vm)}
              multiSelect={ListVM.multiSelect(props.vm)}
              allSelected={ListVM.allSelected(props.vm)}
              onSelectAll={props.onSelectAll}
              onSort={props.onSort}
              sortIcon={(name) => ListVM.sortIcon(props.vm, name)}
            />
            <tbody class="[&_tr:last-child]:border-0">
              <Show
                when={!ListVM.empty(props.vm)}
                fallback={
                  <tr>
                    <td colspan={fields().length + 2} class="h-24 text-center">
                      <div class="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                        <svg
                          class="h-8 w-8 text-muted-foreground/60"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                          <polyline points="13 2 13 9 20 9" />
                        </svg>
                        <span class="text-sm text-muted-foreground">
                          データがありません
                        </span>
                      </div>
                    </td>
                  </tr>
                }
              >
                <For each={rows()}>
                  {(row) => (
                    <ListRow
                      row={row}
                      fields={fields()}
                      selectable={ListVM.selectable(props.vm)}
                      multiSelect={ListVM.multiSelect(props.vm)}
                      selected={ListVM.selected(props.vm, row.id)}
                      clickable={!!props.vm.clickAction}
                      onSelect={props.onSelect}
                      onClick={props.onRowClick}
                      onAction={props.onAction}
                    />
                  )}
                </For>
              </Show>
            </tbody>
          </table>
        </div>

        <ListPagination
          page={ListVM.page(props.vm)}
          totalPages={ListVM.totalPages(props.vm)}
          total={ListVM.total(props.vm)}
          hasNext={ListVM.hasNext(props.vm)}
          hasPrev={ListVM.hasPrev(props.vm)}
          onPageChange={props.onPageChange}
        />
      </Show>
    </div>
  );
};
