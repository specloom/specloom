import type { ListColumnVM, ListRowVM } from "specloom";
import { A } from "@solidjs/router";
import { useI18n } from "@specloom/solidjs";
import { For, Show } from "solid-js";
import { formatColumnValue } from "specloom";
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
  columns: ListColumnVM[];
  rows: ListRowVM[];
  currentSort?: { field: string; direction: "asc" | "desc" };
  clickAction: "none" | "show" | "edit";
  selectedIds: string[];
  onSort: (field: string, direction: "asc" | "desc") => void;
}) {
  const { t, locale } = useI18n();

  return (
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <For each={props.columns}>
              {(col) => (
                <TableHead
                  class={col.sortable ? "cursor-pointer select-none" : ""}
                  onClick={() => {
                    if (!col.sortable) return;
                    const dir =
                      props.currentSort?.field === col.field &&
                      props.currentSort.direction === "asc"
                        ? "desc"
                        : "asc";
                    props.onSort(col.field, dir);
                  }}
                >
                  <span class="flex items-center gap-1">
                    {col.label}
                    <Show when={props.currentSort?.field === col.field}>
                      <span class="text-xs">
                        {props.currentSort?.direction === "asc" ? "↑" : "↓"}
                      </span>
                    </Show>
                  </span>
                </TableHead>
              )}
            </For>
            <Show when={props.clickAction !== "none"}>
              <TableHead class="w-16">{t("list.openColumn")}</TableHead>
            </Show>
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={props.rows}>
            {(row) => (
              <TableRow
                class={
                  props.selectedIds.includes(row.id) ? "bg-muted/50" : ""
                }
              >
                <For each={props.columns}>
                  {(col) => (
                    <TableCell>
                      {presentTextValue(
                        formatColumnValue(col, row.record, { locale }),
                        col.fieldSpec.ui.appearance,
                        row.record[col.field],
                      )}
                    </TableCell>
                  )}
                </For>
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
