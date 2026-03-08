import { For, Show } from "solid-js";
import type { Accessor } from "solid-js";
import type { ListVM, ActionVM, ListFieldVM } from "specloom";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";

interface ListToolbarProps {
  vm: Accessor<ListVM>;
  total?: number;
  filteredCount: number;
  selectedIds: Accessor<Set<string>>;
  hiddenColumns: Accessor<Set<string>>;
  onSearch?: (query: string) => void;
  onToggleColumn: (name: string) => void;
  onAction: (actionId: string, rowId?: string) => void;
  onBulkAction?: (actionId: string, selectedIds: string[]) => void;
}

export function ListToolbar(props: ListToolbarProps) {
  let searchTimer: ReturnType<typeof setTimeout>;
  const handleSearch = (query: string) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      props.onSearch?.(query);
    }, 300);
  };

  return (
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        {/* Search */}
        <Show when={props.vm().isSearchable && props.onSearch}>
          <input
            type="text"
            placeholder="検索..."
            class="h-9 w-64 rounded-md border border-input bg-transparent px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onInput={(e) => handleSearch(e.currentTarget.value)}
          />
        </Show>

        {/* Bulk Actions (shown when rows selected) */}
        <Show when={props.selectedIds().size > 0}>
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">
              {props.selectedIds().size} 件選択
            </span>
            <For each={props.vm().allowedBulkActions}>
              {(action: ActionVM) => (
                <Button
                  variant={action.ui?.variant === "danger" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => props.onBulkAction?.(action.id, [...props.selectedIds()])}
                >
                  {action.label}
                </Button>
              )}
            </For>
          </div>
        </Show>
      </div>

      <div class="flex items-center gap-2">
        {/* Count */}
        <div class="text-sm text-muted-foreground">
          {props.total != null
            ? `${props.filteredCount} / ${props.total} 件`
            : `${props.filteredCount} 件`}
        </div>

        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger as={Button} variant="outline" size="sm">
            表示列
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-48">
            <DropdownMenuLabel>表示する列</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <For each={props.vm().fields}>
              {(field: ListFieldVM) => (
                <DropdownMenuCheckboxItem
                  checked={!props.hiddenColumns().has(field.name)}
                  onChange={() => props.onToggleColumn(field.name)}
                >
                  {field.label}
                </DropdownMenuCheckboxItem>
              )}
            </For>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Page Actions */}
        <For each={props.vm().allowedPageActions}>
          {(action: ActionVM) => (
            <Button
              variant={action.ui?.variant === "primary" ? "default" : "outline"}
              size="sm"
              onClick={() => props.onAction(action.id)}
            >
              {action.label}
            </Button>
          )}
        </For>
      </div>
    </div>
  );
}
