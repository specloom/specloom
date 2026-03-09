import type { CompiledResource } from "@specloom/spec";
import { A } from "@solidjs/router";
import { type SolidListStore, useI18n } from "@specloom/solidjs";
import { createSignal, For, Show } from "solid-js";
import { formatColumnValue } from "specloom";
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
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = createSignal(vm().search.query);

  return (
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">
            {props.resource.meta.pluralLabel ?? props.resource.meta.label}
          </h1>
          <p class="text-sm text-muted-foreground mt-1">
            {t("list.recordCount", { count: vm().rows.length })}
          </p>
        </div>
        <A href={`/resources/${props.resource.name}/new`}>
          <Button>{t("list.newButton", { label: props.resource.meta.label })}</Button>
        </A>
      </div>

          {/* Search */}
          <Show when={vm().search.fields.length > 0}>
            <div class="mb-4 max-w-sm">
              <input
                value={searchQuery()}
                onInput={(e) => {
                  const v = e.currentTarget.value;
                  setSearchQuery(v);
                  store.setSearch(v);
                }}
                placeholder={t("list.searchPlaceholder")}
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
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
                {t("list.filterAll")}
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
                    <TableHead class="w-16">{t("list.openColumn")}</TableHead>
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
                            {presentTextValue(
                              formatColumnValue(col, row.record, { locale }),
                              col.fieldSpec.ui.appearance,
                              row.record[col.field],
                            )}
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
                              {vm().clickAction === "edit" ? t("list.action.edit") : t("list.action.view")}
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
              {t("list.selectionMode", { mode: vm().selection.mode })}
              {vm().selection.selected.length > 0 &&
                ` ${t("list.selectedCount", { count: vm().selection.selected.length })}`}
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

