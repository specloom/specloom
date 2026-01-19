import {
  type Component,
  type JSX,
  For,
  Show,
  children as resolveChildren,
} from "solid-js";
import type { ListFieldVM, RowVM } from "specloom";
import { ListVM, ActionVMHelper } from "specloom";
import { useList } from "./context.jsx";
import { ActionButton } from "../shared/ActionButton.jsx";
import { FieldDisplay } from "../shared/FieldDisplay.jsx";

export interface ListTableProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * ListTable - テーブル全体のコンテナ
 */
export const ListTable: Component<ListTableProps> = (props) => {
  const { loading } = useList();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <Show when={!loading()}>
      <div class={props.class ?? "overflow-x-auto"}>
        <table class="w-full caption-bottom text-sm">
          <Show when={hasChildren()} fallback={<DefaultTableContent />}>
            {resolved()}
          </Show>
        </table>
      </div>
    </Show>
  );
};

function DefaultTableContent() {
  return (
    <>
      <ListTableHeader />
      <ListTableBody />
    </>
  );
}

export interface ListTableHeaderProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * ListTableHeader - テーブルヘッダー
 */
export const ListTableHeader: Component<ListTableHeaderProps> = (props) => {
  const {
    fields,
    selectable,
    multiSelect,
    allSelected,
    onSelectAll,
    onSort,
    vm,
  } = useList();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <thead class={props.class ?? "[&_tr]:border-b"}>
      <Show
        when={hasChildren()}
        fallback={
          <tr>
            <Show when={selectable() && multiSelect()}>
              <th class="h-12 w-12 px-4">
                <input
                  type="checkbox"
                  checked={allSelected()}
                  onChange={() => onSelectAll?.()}
                  class="h-4 w-4 rounded border-input"
                />
              </th>
            </Show>
            <Show when={selectable() && !multiSelect()}>
              <th class="h-12 w-12 px-4" />
            </Show>
            <For each={fields()}>
              {(field) => <ListTableHeaderCell field={field} />}
            </For>
            <th class="h-12 w-20 px-4 text-right text-muted-foreground font-medium">
              操作
            </th>
          </tr>
        }
      >
        {resolved()}
      </Show>
    </thead>
  );
};

export interface ListTableHeaderCellProps {
  field: ListFieldVM;
  class?: string;
}

/**
 * ListTableHeaderCell - 個別のヘッダーセル
 */
export const ListTableHeaderCell: Component<ListTableHeaderCellProps> = (
  props,
) => {
  const { vm, onSort } = useList();
  const sortable = () => props.field.sortable ?? false;
  const sortIcon = () => ListVM.sortIcon(vm(), props.field.name);

  const handleClick = () => {
    if (sortable() && onSort) {
      onSort(props.field.name);
    }
  };

  return (
    <th
      class={
        props.class ??
        `h-12 px-4 text-left align-middle font-medium text-muted-foreground ${
          sortable() ? "cursor-pointer hover:text-foreground" : ""
        }`
      }
      onClick={handleClick}
    >
      <div class="flex items-center gap-1">
        <span>{props.field.label}</span>
        <Show when={sortable()}>
          <span class="text-xs">{sortIcon()}</span>
        </Show>
      </div>
    </th>
  );
};

export interface ListTableBodyProps {
  class?: string;
  children?: JSX.Element | ((row: RowVM) => JSX.Element);
}

/**
 * ListTableBody - テーブルボディ
 */
export const ListTableBody: Component<ListTableBodyProps> = (props) => {
  const { rows, fields, empty } = useList();

  const renderRow = () => {
    if (typeof props.children === "function") {
      return props.children;
    }
    return undefined;
  };

  return (
    <tbody class={props.class ?? "[&_tr:last-child]:border-0"}>
      <Show
        when={!empty()}
        fallback={
          <tr>
            <td colspan={fields().length + 2} class="h-24 text-center">
              <ListEmpty />
            </td>
          </tr>
        }
      >
        <For each={rows()}>
          {(row) => (
            <Show when={renderRow()} fallback={<ListTableRow row={row} />}>
              {renderRow()!(row)}
            </Show>
          )}
        </For>
      </Show>
    </tbody>
  );
};

export interface ListTableRowProps {
  row: RowVM;
  class?: string;
  children?: JSX.Element;
}

/**
 * ListTableRow - テーブル行
 */
export const ListTableRow: Component<ListTableRowProps> = (props) => {
  const {
    fields,
    selectable,
    multiSelect,
    onSelect,
    onRowClick,
    onAction,
    vm,
  } = useList();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  const selected = () => ListVM.selected(vm(), props.row.id);
  const clickable = () => !!vm().clickAction;
  const allowedActions = () => ActionVMHelper.allowed(props.row.actions);

  const handleRowClick = () => {
    if (clickable() && onRowClick) {
      onRowClick(props.row.id);
    }
  };

  return (
    <tr
      class={
        props.class ??
        `border-b transition-colors hover:bg-muted/50 ${
          selected() ? "bg-muted" : ""
        } ${clickable() ? "cursor-pointer" : ""}`
      }
      onClick={handleRowClick}
    >
      <Show
        when={hasChildren()}
        fallback={
          <>
            <Show when={selectable()}>
              <td class="w-12 px-4">
                <input
                  type={multiSelect() ? "checkbox" : "radio"}
                  checked={selected()}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelect?.(props.row.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  class="h-4 w-4 rounded border-input"
                />
              </td>
            </Show>
            <For each={fields()}>
              {(field) => <ListTableCell field={field} row={props.row} />}
            </For>
            <td class="w-20 px-4 text-right">
              <div
                class="flex items-center justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <For each={allowedActions()}>
                  {(action) => (
                    <ActionButton
                      action={action}
                      onExecute={(id) => onAction?.(id, [props.row.id])}
                      size="sm"
                      variant="ghost"
                    />
                  )}
                </For>
              </div>
            </td>
          </>
        }
      >
        {resolved()}
      </Show>
    </tr>
  );
};

export interface ListTableCellProps {
  field: ListFieldVM;
  row: RowVM;
  class?: string;
}

/**
 * ListTableCell - テーブルセル
 */
export const ListTableCell: Component<ListTableCellProps> = (props) => {
  const value = () => props.row.values[props.field.name];

  return (
    <td class={props.class ?? "p-4 align-middle"}>
      <FieldDisplay field={props.field} value={value()} />
    </td>
  );
};

/**
 * ListEmpty - データがない場合の表示
 */
export const ListEmpty: Component<{ class?: string }> = (props) => {
  return (
    <div
      class={
        props.class ??
        "flex flex-col items-center justify-center gap-1 text-muted-foreground"
      }
    >
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
      <span class="text-sm text-muted-foreground">データがありません</span>
    </div>
  );
};
