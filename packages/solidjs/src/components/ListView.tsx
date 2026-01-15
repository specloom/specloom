import { For, Show } from "solid-js";
import { ListVM, type ListViewModel } from "specloom";
import { css } from "../../styled-system/css";
import { ActionButton } from "./ActionButton.js";
import { FieldDisplay } from "./FieldDisplay.js";

export interface ListViewProps {
  vm: ListViewModel;
  onSort?: (field: string) => void;
  onSelect?: (rowId: string) => void;
  onSelectAll?: () => void;
  onAction: (actionId: string, rowIds?: string[]) => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (rowId: string) => void;
}

export function ListView(props: ListViewProps) {
  const handleHeaderClick = (fieldName: string) => {
    if (ListVM.sortable(props.vm, fieldName) && props.onSort) {
      props.onSort(fieldName);
    }
  };

  const handleRowClick = (rowId: string) => {
    if (props.onRowClick && ListVM.clickAction(props.vm)) {
      props.onRowClick(rowId);
    }
  };

  return (
    <div class={css({ display: "flex", flexDirection: "column", gap: 4 })}>
      {/* Header */}
      <div
        class={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <h1 class={css({ fontSize: "2xl", fontWeight: "bold" })}>
          {ListVM.label(props.vm)}
        </h1>
        <div class={css({ display: "flex", gap: 2 })}>
          <For each={ListVM.allowedActions(ListVM.headerActions(props.vm))}>
            {(action) => (
              <ActionButton action={action} onExecute={props.onAction} />
            )}
          </For>
        </div>
      </div>

      {/* Bulk Actions */}
      <Show when={ListVM.selectedCount(props.vm) > 0}>
        <div
          class={css({
            display: "flex",
            alignItems: "center",
            gap: 4,
            p: 3,
            bg: "blue.50",
            borderRadius: "md",
          })}
        >
          <span class={css({ color: "blue.700", fontWeight: "medium" })}>
            {ListVM.selectedCount(props.vm)}件選択中
          </span>
          <div class={css({ display: "flex", gap: 2 })}>
            <For each={ListVM.allowedActions(ListVM.bulkActions(props.vm))}>
              {(action) => (
                <ActionButton
                  action={action}
                  onExecute={(actionId) =>
                    props.onAction(actionId, ListVM.selectedIds(props.vm))
                  }
                  size="sm"
                />
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Loading */}
      <Show when={ListVM.loading(props.vm)}>
        <div class={css({ textAlign: "center", py: 8, color: "gray.500" })}>
          読み込み中...
        </div>
      </Show>

      {/* Error */}
      <Show when={ListVM.error(props.vm)}>
        <div
          class={css({
            p: 4,
            bg: "red.50",
            borderRadius: "md",
            color: "red.700",
          })}
        >
          {ListVM.error(props.vm)}
        </div>
      </Show>

      {/* Empty */}
      <Show when={!ListVM.loading(props.vm) && ListVM.empty(props.vm)}>
        <div
          class={css({
            textAlign: "center",
            py: 12,
            color: "gray.500",
            bg: "gray.50",
            borderRadius: "lg",
          })}
        >
          データがありません
        </div>
      </Show>

      {/* Table */}
      <Show when={!ListVM.loading(props.vm) && !ListVM.empty(props.vm)}>
        <div
          class={css({
            bg: "white",
            borderRadius: "lg",
            shadow: "sm",
            borderWidth: 1,
            borderColor: "gray.200",
            overflow: "hidden",
          })}
        >
          <table class={css({ w: "full", borderCollapse: "collapse" })}>
            <thead>
              <tr
                class={css({
                  bg: "gray.50",
                  borderBottomWidth: 1,
                  borderColor: "gray.200",
                })}
              >
                {/* Selection Checkbox */}
                <Show when={ListVM.selectable(props.vm)}>
                  <th class={css({ w: 12, px: 4, py: 3 })}>
                    <Show when={ListVM.multiSelect(props.vm)}>
                      <input
                        type="checkbox"
                        checked={ListVM.allSelected(props.vm)}
                        onChange={() => props.onSelectAll?.()}
                        class={css({ cursor: "pointer" })}
                      />
                    </Show>
                  </th>
                </Show>

                {/* Field Headers */}
                <For each={ListVM.fields(props.vm)}>
                  {(field) => (
                    <th
                      class={css({
                        px: 4,
                        py: 3,
                        textAlign: "left",
                        fontWeight: "semibold",
                        fontSize: "sm",
                        color: "gray.700",
                        cursor: field.sortable ? "pointer" : "default",
                        userSelect: "none",
                        _hover: field.sortable ? { bg: "gray.100" } : {},
                      })}
                      onClick={() => handleHeaderClick(field.name)}
                    >
                      <span
                        class={css({
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        })}
                      >
                        {field.label}
                        <Show when={field.sortable}>
                          <span class={css({ color: "gray.400" })}>
                            {ListVM.sortIcon(props.vm, field.name)}
                          </span>
                        </Show>
                      </span>
                    </th>
                  )}
                </For>

                {/* Actions Header */}
                <th class={css({ w: 32, px: 4, py: 3 })} />
              </tr>
            </thead>
            <tbody>
              <For each={ListVM.rows(props.vm)}>
                {(row) => (
                  <tr
                    class={css({
                      borderBottomWidth: 1,
                      borderColor: "gray.100",
                      _last: { borderBottomWidth: 0 },
                      _hover: { bg: "gray.50" },
                      cursor: ListVM.clickAction(props.vm)
                        ? "pointer"
                        : "default",
                    })}
                    onClick={() => handleRowClick(row.id)}
                  >
                    {/* Selection */}
                    <Show when={ListVM.selectable(props.vm)}>
                      <td
                        class={css({ px: 4, py: 3 })}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type={
                            ListVM.multiSelect(props.vm) ? "checkbox" : "radio"
                          }
                          name={
                            ListVM.singleSelect(props.vm)
                              ? `${ListVM.resource(props.vm)}-selection`
                              : undefined
                          }
                          checked={ListVM.selected(props.vm, row.id)}
                          onChange={() => props.onSelect?.(row.id)}
                          class={css({ cursor: "pointer" })}
                        />
                      </td>
                    </Show>

                    {/* Field Values */}
                    <For each={ListVM.fields(props.vm)}>
                      {(field) => (
                        <td class={css({ px: 4, py: 3 })}>
                          <FieldDisplay
                            field={field}
                            value={ListVM.cellValue(row, field.name)}
                          />
                        </td>
                      )}
                    </For>

                    {/* Row Actions */}
                    <td
                      class={css({ px: 4, py: 3, textAlign: "right" })}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        class={css({
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                        })}
                      >
                        <For
                          each={ListVM.allowedActions(ListVM.rowActions(row))}
                        >
                          {(action) => (
                            <ActionButton
                              action={action}
                              onExecute={(actionId) =>
                                props.onAction(actionId, [row.id])
                              }
                              size="sm"
                            />
                          )}
                        </For>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Show when={ListVM.totalPages(props.vm) > 1}>
          <div
            class={css({
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              pt: 4,
            })}
          >
            <button
              type="button"
              disabled={!ListVM.hasPrev(props.vm)}
              onClick={() => props.onPageChange?.(ListVM.page(props.vm) - 1)}
              class={css({
                px: 3,
                py: 1.5,
                borderRadius: "md",
                borderWidth: 1,
                borderColor: "gray.300",
                bg: "white",
                cursor: "pointer",
                _hover: { bg: "gray.50" },
                _disabled: { opacity: 0.5, cursor: "not-allowed" },
              })}
            >
              前へ
            </button>
            <span class={css({ px: 3, color: "gray.600" })}>
              {ListVM.page(props.vm)} / {ListVM.totalPages(props.vm)}
            </span>
            <button
              type="button"
              disabled={!ListVM.hasNext(props.vm)}
              onClick={() => props.onPageChange?.(ListVM.page(props.vm) + 1)}
              class={css({
                px: 3,
                py: 1.5,
                borderRadius: "md",
                borderWidth: 1,
                borderColor: "gray.300",
                bg: "white",
                cursor: "pointer",
                _hover: { bg: "gray.50" },
                _disabled: { opacity: 0.5, cursor: "not-allowed" },
              })}
            >
              次へ
            </button>
          </div>
        </Show>
      </Show>
    </div>
  );
}
