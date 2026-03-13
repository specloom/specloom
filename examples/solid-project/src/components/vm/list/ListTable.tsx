import type { ActionVM, ListFieldVM, ListRowVM } from "specloom";
import { A } from "@solidjs/router";
import { useI18n } from "@specloom/solidjs";
import { For, Show } from "solid-js";
import { formatColumnValue } from "specloom";
import { Checkbox } from "~/components/ui/checkbox";
import { ActionButton } from "~/components/vm/ActionButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { presentTextValue } from "~/components/vm/SpecValue";

export function ListTable(props: {
  resourceName: string;
  columns: ListFieldVM[];
  rows: ListRowVM[];
  currentSort?: { field: string; direction: "asc" | "desc" };
  clickAction: "none" | "show" | "edit";
  selectionMode: "none" | "single" | "multi";
  showRowActionsColumn: boolean;
  selectedIds: string[];
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  onSort: (field: string, direction: "asc" | "desc") => void;
  onRowAction: (action: ActionVM, row: ListRowVM) => void;
  onToggleRow: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
}) {
  const { t, locale } = useI18n();

  return (
    <div class="min-w-0 max-w-full rounded-md border">
      <Table class="min-w-max whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <Show when={props.selectionMode !== "none"}>
              <TableHead class="w-12">
                <Show when={props.selectionMode === "multi"}>
                  <div class="flex items-center justify-center">
                    <Checkbox
                      aria-label={t("list.selectAll")}
                      checked={props.allVisibleSelected}
                      indeterminate={props.someVisibleSelected}
                      disabled={props.rows.length === 0}
                      onChange={() =>
                        props.onToggleAll(!props.allVisibleSelected)
                      }
                    />
                  </div>
                </Show>
                <Show when={props.selectionMode !== "multi"}>
                  <span class="sr-only">{t("list.selectRow")}</span>
                </Show>
              </TableHead>
            </Show>
            <For each={props.columns}>
              {(col) => (
                <TableHead
                  class={col.sortable ? "cursor-pointer select-none" : ""}
                  onClick={() => {
                    if (!col.sortable) return;
                    const dir =
                      props.currentSort?.field === col.name &&
                      props.currentSort.direction === "asc"
                        ? "desc"
                        : "asc";
                    props.onSort(col.name, dir);
                  }}
                >
                  <span class="flex items-center gap-1">
                    {col.label}
                    <Show when={props.currentSort?.field === col.name}>
                      <span class="text-xs">
                        {props.currentSort?.direction === "asc" ? "↑" : "↓"}
                      </span>
                    </Show>
                  </span>
                </TableHead>
              )}
            </For>
            <Show when={props.showRowActionsColumn}>
              <TableHead>{t("list.actionsColumn")}</TableHead>
            </Show>
            <Show when={props.clickAction !== "none"}>
              <TableHead class="w-16">{t("list.openColumn")}</TableHead>
            </Show>
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={props.rows}>
            {(row) => (
              <TableRow
                class={props.selectedIds.includes(row.id) ? "bg-muted/50" : ""}
              >
                <Show when={props.selectionMode !== "none"}>
                  <TableCell class="w-12">
                    <div class="flex items-center justify-center">
                      <Checkbox
                        aria-label={t("list.selectRow")}
                        checked={props.selectedIds.includes(row.id)}
                        onChange={() => props.onToggleRow(row.id)}
                      />
                    </div>
                  </TableCell>
                </Show>
                <For each={props.columns}>
                  {(col) => (
                    <TableCell>
                      {presentTextValue(
                        formatColumnValue(col, row.record, { locale }),
                        col.fieldSpec.ui.appearance,
                        row.record[col.name],
                      )}
                    </TableCell>
                  )}
                </For>
                <Show when={props.showRowActionsColumn}>
                  <TableCell>
                    <div class="flex flex-wrap gap-1">
                      <For
                        each={row.actions.filter((action) => action.visible)}
                      >
                        {(action) => (
                          <ActionButton
                            action={action}
                            size="sm"
                            onAction={(nextAction) =>
                              props.onRowAction(nextAction, row)
                            }
                          />
                        )}
                      </For>
                      <Show
                        when={row.actions.every((action) => !action.visible)}
                      >
                        <span class="text-xs text-muted-foreground">-</span>
                      </Show>
                    </div>
                  </TableCell>
                </Show>
                <Show
                  when={rowHref(props.resourceName, props.clickAction, row.id)}
                >
                  {(href) => (
                    <TableCell>
                      <A
                        href={href()}
                        class="text-sm text-primary hover:underline"
                      >
                        {props.clickAction === "edit"
                          ? t("list.action.edit")
                          : t("list.action.view")}
                      </A>
                    </TableCell>
                  )}
                </Show>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </div>
  );
}

function rowHref(
  resource: string,
  clickAction: "none" | "show" | "edit",
  id: string,
) {
  if (!id || clickAction === "none") {
    return undefined;
  }

  return clickAction === "edit"
    ? `/resources/${resource}/${id}/edit`
    : `/resources/${resource}/${id}`;
}
