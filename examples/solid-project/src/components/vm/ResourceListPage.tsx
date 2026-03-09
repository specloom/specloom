import type { CompiledResource } from "@specloom/spec";
import { A } from "@solidjs/router";
import type { SolidListStore } from "@specloom/solidjs";
import { For, Show } from "solid-js";
import { formatColumnValue, type ListColumnVM } from "specloom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import { Button } from "~/components/ui/button";
import { presentTextValue } from "~/components/vm/SpecValue";

export function ResourceListPage(props: {
  store: SolidListStore;
  resource: CompiledResource;
}) {
  const store = props.store;
  const vm = () => store.view();

  return (
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">
            {props.resource.meta.pluralLabel ?? props.resource.meta.label}
          </h1>
          <p class="text-sm text-muted-foreground mt-1">
            {vm().rows.length} records
          </p>
        </div>
        <A href={`/resources/${props.resource.name}/new`}>
          <Button>New {props.resource.meta.label}</Button>
        </A>
      </div>

          {/* Search */}
          <Show when={vm().search.fields.length > 0}>
            <div class="mb-4 max-w-sm">
              <TextField
                value={vm().search.query}
                onChange={(v: string) => store.setSearch(v)}
              >
                <TextFieldInput placeholder="Search..." />
              </TextField>
            </div>
          </Show>

          {/* Named Filters */}
          <Show when={vm().namedFilters.length > 0}>
            <div class="mb-4 flex gap-2">
              <Button
                variant={
                  vm().namedFilters.every((f) => !f.active)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => store.setNamedFilter(null)}
              >
                All
              </Button>
              <For each={vm().namedFilters}>
                {(filter) => (
                  <Button
                    variant={filter.active ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      store.setNamedFilter(filter.active ? null : filter.id)
                    }
                  >
                    {filter.label}
                  </Button>
                )}
              </For>
            </div>
          </Show>

          {/* Table */}
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <For each={vm().columns}>
                    {(col) => (
                      <TableHead
                        class={col.sortable ? "cursor-pointer select-none" : ""}
                        onClick={() => {
                          if (!col.sortable) return;
                          const current = vm().currentSort;
                          const dir =
                            current?.field === col.field &&
                            current.direction === "asc"
                              ? "desc"
                              : "asc";
                          store.setSort(col.field, dir);
                        }}
                      >
                        <span class="flex items-center gap-1">
                          {col.label}
                          <Show when={vm().currentSort?.field === col.field}>
                            <span class="text-xs">
                              {vm().currentSort?.direction === "asc"
                                ? "↑"
                                : "↓"}
                            </span>
                          </Show>
                        </span>
                      </TableHead>
                    )}
                  </For>
                  <Show when={vm().clickAction !== "none"}>
                    <TableHead class="w-16">Open</TableHead>
                  </Show>
                </TableRow>
              </TableHeader>
              <TableBody>
                <For each={vm().rows}>
                  {(row) => (
                    <TableRow
                      class={
                        vm().selection.selected.includes(row.id)
                          ? "bg-muted/50"
                          : ""
                      }
                    >
                      <For each={vm().columns}>
                        {(col) => (
                          <TableCell>
                            {renderColumnCell(col, row.record)}
                          </TableCell>
                        )}
                      </For>
                      <Show
                        when={rowHref(props.resource.name, vm().clickAction, row.id)}
                      >
                        {(href) => (
                          <TableCell>
                            <A
                              href={href()}
                              class="text-sm text-primary hover:underline"
                            >
                              {linkLabel(vm().clickAction)}
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

          {/* Selection info */}
          <Show when={vm().selection.mode !== "none"}>
            <div class="mt-2 text-sm text-muted-foreground">
              Selection mode: {vm().selection.mode}
              {vm().selection.selected.length > 0 &&
                ` (${vm().selection.selected.length} selected)`}
            </div>
          </Show>

          {/* Page Actions */}
          <Show when={vm().pageActions.length > 0}>
            <div class="mt-4 flex gap-2">
              <For each={vm().pageActions}>
                {(action) => (
                  <Show when={action.visible}>
                    <Button
                      variant={
                        action.prominence === "primary" ? "default" : "outline"
                      }
                      size="sm"
                      disabled={action.disabled}
                      onClick={() => alert(`Action: ${action.label}`)}
                    >
                      {action.label}
                    </Button>
                  </Show>
                )}
              </For>
            </div>
          </Show>
        </div>
  );
}

function renderColumnCell(
  column: ListColumnVM,
  record: Record<string, unknown>,
) {
  return presentTextValue(
    formatColumnValue(column, record),
    column.fieldSpec.ui.appearance,
    record[column.field],
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

function linkLabel(clickAction: "none" | "show" | "edit") {
  return clickAction === "edit" ? "Edit" : "View";
}
