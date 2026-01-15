import { For, Show, createSignal } from "solid-js";
import type { ListViewModel, ListFieldVM, RowVM, ActionVM } from "specloom";
import { styled } from "../../styled-system/jsx";
import { css } from "../../styled-system/css";
import { table } from "../../styled-system/recipes";
import { input } from "../../styled-system/recipes";
import { button } from "../../styled-system/recipes";
import { badge } from "../../styled-system/recipes";
import { ActionButton } from "./ActionButton.tsx";

// ============================================================
// Styled Components
// ============================================================

const StyledInput = styled("input", input);
const StyledButton = styled("button", button);
const StyledBadge = styled("span", badge);

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

  const tableStyles = table();

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
    props.onAction(actionId);
  };

  return (
    <div
      data-specloom="list-view"
      class={css({ display: "flex", flexDirection: "column", gap: "4" })}
    >
      {/* Header */}
      <header
        data-specloom="list-header"
        class={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <h1
          data-specloom="list-title"
          class={css({ fontSize: "2xl", fontWeight: "semibold" })}
        >
          {props.vm.label}
        </h1>

        {/* Header Actions */}
        <div
          data-specloom="list-header-actions"
          class={css({ display: "flex", gap: "2" })}
        >
          <For each={props.vm.headerActions}>
            {(action) => (
              <ActionButton action={action} onExecute={handleHeaderAction} />
            )}
          </For>
        </div>
      </header>

      {/* Search & Filters */}
      <div
        data-specloom="list-toolbar"
        class={css({
          display: "flex",
          gap: "3",
          alignItems: "center",
          flexWrap: "wrap",
        })}
      >
        {/* Search */}
        <Show when={props.vm.search.fields.length > 0}>
          <StyledInput
            type="search"
            placeholder="検索..."
            value={searchQuery()}
            onInput={(e) => handleSearch(e.currentTarget.value)}
            size="sm"
            class={css({ minWidth: "200px" })}
          />
        </Show>

        {/* Named Filters */}
        <Show when={props.vm.filters.named.length > 0}>
          <div class={css({ display: "flex", gap: "2" })}>
            <For each={props.vm.filters.named}>
              {(filter) => (
                <StyledButton
                  type="button"
                  variant={filter.active ? "solid" : "outline"}
                  size="xs"
                  onClick={() =>
                    props.onFilterChange?.(filter.id, !filter.active)
                  }
                >
                  {filter.label}
                </StyledButton>
              )}
            </For>
          </div>
        </Show>

        {/* Bulk Actions */}
        <Show
          when={selectedIds().length > 0 && props.vm.bulkActions.length > 0}
        >
          <div
            class={css({
              display: "flex",
              gap: "2",
              alignItems: "center",
              ml: "auto",
            })}
          >
            <StyledBadge variant="solid">
              {selectedIds().length}件選択中
            </StyledBadge>
            <For each={props.vm.bulkActions}>
              {(action) => (
                <ActionButton action={action} onExecute={handleBulkAction} />
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Table */}
      <div
        data-specloom="list-table-wrapper"
        class={css({ overflowX: "auto" })}
      >
        <table data-specloom="list-table" class={tableStyles.root}>
          <thead class={tableStyles.head}>
            <tr class={tableStyles.row}>
              {/* Selection checkbox */}
              <Show when={props.vm.selection.mode !== "none"}>
                <th class={tableStyles.header} style={{ width: "40px" }}>
                  <Show when={props.vm.selection.mode === "multi"}>
                    <input
                      type="checkbox"
                      checked={isAllSelected()}
                      onChange={(e) => handleSelectAll(e.currentTarget.checked)}
                      class={css({ cursor: "pointer" })}
                    />
                  </Show>
                </th>
              </Show>

              {/* Column headers */}
              <For each={props.vm.fields}>
                {(field) => (
                  <th class={tableStyles.header}>
                    <Show
                      when={field.sortable}
                      fallback={<span>{field.label}</span>}
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(field.name)}
                        class={css({
                          display: "flex",
                          alignItems: "center",
                          gap: "1",
                          cursor: "pointer",
                          bg: "transparent",
                          border: "none",
                          fontWeight: "inherit",
                          color: "inherit",
                          _hover: { color: "accent.11" },
                        })}
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
                <th class={tableStyles.header}>操作</th>
              </Show>
            </tr>
          </thead>

          <tbody class={tableStyles.body}>
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
                  tableStyles={tableStyles}
                />
              )}
            </For>
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      <Show when={props.vm.rows.length === 0}>
        <div
          data-specloom="list-empty"
          class={css({
            textAlign: "center",
            py: "8",
            color: "fg.muted",
            bg: "bg.muted",
            borderRadius: "md",
          })}
        >
          データがありません
        </div>
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
  tableStyles: ReturnType<typeof table>;
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
      data-specloom="list-row"
      data-selected={props.isSelected || undefined}
      class={css({
        cursor: props.clickAction || props.onRowClick ? "pointer" : "default",
        _hover: props.clickAction || props.onRowClick ? { bg: "bg.muted" } : {},
        bg: props.isSelected ? "accent.a3" : undefined,
      })}
      onClick={handleRowClick}
    >
      {/* Selection checkbox */}
      <Show when={props.selectionMode !== "none"}>
        <td class={props.tableStyles.cell} onClick={(e) => e.stopPropagation()}>
          <input
            type={props.selectionMode === "single" ? "radio" : "checkbox"}
            checked={props.isSelected}
            onChange={(e) =>
              props.onSelect(props.row.id, e.currentTarget.checked)
            }
            class={css({ cursor: "pointer" })}
          />
        </td>
      </Show>

      {/* Cell values */}
      <For each={props.fields}>
        {(field) => (
          <td class={props.tableStyles.cell}>
            <CellValue field={field} value={props.row.values[field.name]} />
          </td>
        )}
      </For>

      {/* Row actions */}
      <Show when={props.row.actions.length > 0}>
        <td class={props.tableStyles.cell} onClick={(e) => e.stopPropagation()}>
          <div class={css({ display: "flex", gap: "1" })}>
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

const StatusBadge = styled("span", badge);

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

  // Status fields get special badge styling
  if (props.field.kind === "status") {
    return (
      <StatusBadge size="sm" variant="outline">
        {displayValue()}
      </StatusBadge>
    );
  }

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
    <span class={css({ opacity: isActive() ? 1 : 0.4, fontSize: "sm" })}>
      <Show when={isActive()} fallback={<span>⇅</span>}>
        <span>{order() === "asc" ? "↑" : "↓"}</span>
      </Show>
    </span>
  );
}
