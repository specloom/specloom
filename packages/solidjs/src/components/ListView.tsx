import { For, Show, createSignal } from "solid-js";
import type { ListViewModel, ListFieldVM, RowVM, ActionVM } from "specloom";
import { ActionButton } from "./ActionButton.tsx";

// ============================================================
// Types
// ============================================================

export interface ListViewProps {
  vm: ListViewModel;
  onAction: (actionId: string, rowId?: string) => void;
  onRowClick?: (rowId: string) => void;
  onSort?: (field: string, order: "asc" | "desc") => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filterId: string, active: boolean) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
}

// ============================================================
// ListView Component
// ============================================================

export function ListView(props: ListViewProps) {
  const [searchQuery, setSearchQuery] = createSignal(props.vm.search.query);
  const [selectedIds, setSelectedIds] = createSignal<string[]>(
    props.vm.selection.selected,
  );
  const [currentSort, setCurrentSort] = createSignal(props.vm.defaultSort);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    props.onSearch?.(query);
  };

  const handleSort = (field: string) => {
    const current = currentSort();
    const newOrder =
      current?.field === field && current.order === "asc" ? "desc" : "asc";
    setCurrentSort({ field, order: newOrder });
    props.onSort?.(field, newOrder);
  };

  const handleRowSelect = (rowId: string, selected: boolean) => {
    const current = selectedIds();
    const newSelection = selected
      ? [...current, rowId]
      : current.filter((id) => id !== rowId);
    setSelectedIds(newSelection);
    props.onSelectionChange?.(newSelection);
  };

  const handleSelectAll = (selected: boolean) => {
    const newSelection = selected ? props.vm.rows.map((r) => r.id) : [];
    setSelectedIds(newSelection);
    props.onSelectionChange?.(newSelection);
  };

  const isAllSelected = () =>
    props.vm.rows.length > 0 && selectedIds().length === props.vm.rows.length;

  const handleRowAction = (actionId: string, rowId: string) => {
    props.onAction(actionId, rowId);
  };

  const handleHeaderAction = (actionId: string) => {
    props.onAction(actionId);
  };

  const handleBulkAction = (actionId: string) => {
    // Bulk action uses selected rows
    props.onAction(actionId);
  };

  return (
    <div data-component="list-view">
      {/* Header */}
      <header>
        <h1>{props.vm.label}</h1>

        {/* Header Actions */}
        <div data-slot="header-actions">
          <For each={props.vm.headerActions}>
            {(action) => (
              <ActionButton action={action} onExecute={handleHeaderAction} />
            )}
          </For>
        </div>
      </header>

      {/* Search & Filters */}
      <div data-slot="toolbar">
        {/* Search */}
        <Show when={props.vm.search.fields.length > 0}>
          <input
            type="search"
            placeholder="検索..."
            value={searchQuery()}
            onInput={(e) => handleSearch(e.currentTarget.value)}
          />
        </Show>

        {/* Named Filters */}
        <Show when={props.vm.filters.named.length > 0}>
          <div data-slot="filters">
            <For each={props.vm.filters.named}>
              {(filter) => (
                <button
                  type="button"
                  data-active={filter.active}
                  onClick={() =>
                    props.onFilterChange?.(filter.id, !filter.active)
                  }
                >
                  {filter.label}
                </button>
              )}
            </For>
          </div>
        </Show>

        {/* Bulk Actions */}
        <Show
          when={selectedIds().length > 0 && props.vm.bulkActions.length > 0}
        >
          <div data-slot="bulk-actions">
            <span>{selectedIds().length}件選択中</span>
            <For each={props.vm.bulkActions}>
              {(action) => (
                <ActionButton action={action} onExecute={handleBulkAction} />
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            {/* Selection checkbox */}
            <Show when={props.vm.selection.mode !== "none"}>
              <th>
                <Show when={props.vm.selection.mode === "multi"}>
                  <input
                    type="checkbox"
                    checked={isAllSelected()}
                    onChange={(e) => handleSelectAll(e.currentTarget.checked)}
                  />
                </Show>
              </th>
            </Show>

            {/* Column headers */}
            <For each={props.vm.fields}>
              {(field) => (
                <th>
                  <Show
                    when={field.sortable}
                    fallback={<span>{field.label}</span>}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(field.name)}
                      data-sorted={currentSort()?.field === field.name}
                      data-order={currentSort()?.order}
                    >
                      {field.label}
                      <SortIndicator
                        field={field.name}
                        currentSort={currentSort()}
                      />
                    </button>
                  </Show>
                </th>
              )}
            </For>

            {/* Actions column */}
            <Show when={props.vm.rows.some((r) => r.actions.length > 0)}>
              <th>操作</th>
            </Show>
          </tr>
        </thead>

        <tbody>
          <For each={props.vm.rows}>
            {(row) => (
              <ListRow
                row={row}
                fields={props.vm.fields}
                selectionMode={props.vm.selection.mode}
                isSelected={selectedIds().includes(row.id)}
                onSelect={handleRowSelect}
                onAction={handleRowAction}
                onRowClick={props.onRowClick}
                clickAction={props.vm.clickAction}
              />
            )}
          </For>
        </tbody>
      </table>

      {/* Empty state */}
      <Show when={props.vm.rows.length === 0}>
        <div data-slot="empty">データがありません</div>
      </Show>
    </div>
  );
}

// ============================================================
// ListRow Component
// ============================================================

interface ListRowProps {
  row: RowVM;
  fields: ListFieldVM[];
  selectionMode: "none" | "single" | "multi";
  isSelected: boolean;
  onSelect: (rowId: string, selected: boolean) => void;
  onAction: (actionId: string, rowId: string) => void;
  onRowClick?: (rowId: string) => void;
  clickAction?: string;
}

function ListRow(props: ListRowProps) {
  const handleRowClick = () => {
    if (props.clickAction) {
      props.onAction(props.clickAction, props.row.id);
    } else {
      props.onRowClick?.(props.row.id);
    }
  };

  return (
    <tr
      data-selected={props.isSelected}
      onClick={handleRowClick}
      style={{
        cursor: props.clickAction || props.onRowClick ? "pointer" : "default",
      }}
    >
      {/* Selection checkbox */}
      <Show when={props.selectionMode !== "none"}>
        <td onClick={(e) => e.stopPropagation()}>
          <input
            type={props.selectionMode === "single" ? "radio" : "checkbox"}
            checked={props.isSelected}
            onChange={(e) =>
              props.onSelect(props.row.id, e.currentTarget.checked)
            }
          />
        </td>
      </Show>

      {/* Cell values */}
      <For each={props.fields}>
        {(field) => (
          <td>
            <CellValue field={field} value={props.row.values[field.name]} />
          </td>
        )}
      </For>

      {/* Row actions */}
      <Show when={props.row.actions.length > 0}>
        <td onClick={(e) => e.stopPropagation()}>
          <div data-slot="row-actions">
            <For each={props.row.actions}>
              {(action) => (
                <ActionButton
                  action={action}
                  onExecute={(actionId) =>
                    props.onAction(actionId, props.row.id)
                  }
                />
              )}
            </For>
          </div>
        </td>
      </Show>
    </tr>
  );
}

// ============================================================
// CellValue Component
// ============================================================

interface CellValueProps {
  field: ListFieldVM;
  value: unknown;
}

function CellValue(props: CellValueProps) {
  const displayValue = () => {
    const value = props.value;
    if (value === null || value === undefined) return "-";

    switch (props.field.kind) {
      case "boolean":
        return value ? "Yes" : "No";

      case "enum":
      case "status": {
        const option = props.field.options?.find((o) => o.value === value);
        return option?.label ?? String(value);
      }

      case "relation": {
        const rel = value as Record<string, unknown>;
        const labelField = props.field.relation?.labelField ?? "name";
        return String(rel[labelField] ?? rel.id ?? "-");
      }

      case "date":
        try {
          return new Date(String(value)).toLocaleDateString();
        } catch {
          return String(value);
        }

      case "datetime":
        try {
          return new Date(String(value)).toLocaleString();
        } catch {
          return String(value);
        }

      default:
        return String(value);
    }
  };

  return <span>{displayValue()}</span>;
}

// ============================================================
// SortIndicator Component
// ============================================================

interface SortIndicatorProps {
  field: string;
  currentSort?: { field: string; order: "asc" | "desc" };
}

function SortIndicator(props: SortIndicatorProps) {
  const isActive = () => props.currentSort?.field === props.field;
  const order = () => props.currentSort?.order;

  return (
    <span data-sort-indicator>
      <Show when={isActive()} fallback={<span>⇅</span>}>
        <span>{order() === "asc" ? "↑" : "↓"}</span>
      </Show>
    </span>
  );
}
