import type { CompiledResource } from "@specloom/spec";
import type { SolidListStore } from "@specloom/solidjs";
import { useI18n } from "@specloom/solidjs";
import { resolvePathValues } from "specloom";
import { createMemo, createSignal, Show } from "solid-js";
import { ListHeader } from "~/components/vm/list/ListHeader";
import { ListSearch } from "~/components/vm/list/ListSearch";
import { ListNamedFilters } from "~/components/vm/list/ListNamedFilters";
import { ListFieldFilters } from "~/components/vm/list/ListFieldFilters";
import { ListTable } from "~/components/vm/list/ListTable";
import { ListPagination } from "~/components/vm/list/ListPagination";
import {
  ListSelectionInfo,
  ListSelectionActions,
  ListPageActions,
} from "~/components/vm/list/ListActions";

export function ResourceListPage(props: {
  store: SolidListStore;
  resource: CompiledResource;
  loading?: boolean;
  error?: string;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}) {
  const store = props.store;
  const vm = () => store.view();
  const { t } = useI18n();
  const [fieldFilters, setFieldFilters] = createSignal<Record<string, string>>(
    {},
  );

  const filteredRows = createMemo(() => {
    const filters = fieldFilters();
    const active = Object.entries(filters).filter(([, v]) => v.trim() !== "");
    if (active.length === 0) return vm().rows;
    return vm().rows.filter((row) =>
      active.every(([key, query]) => {
        if (key.endsWith("__gte")) {
          const field = key.slice(0, -5);
          return resolvePathValues(row.record, field).some(
            (value) => String(value ?? "") >= query,
          );
        }
        if (key.endsWith("__lte")) {
          const field = key.slice(0, -5);
          return resolvePathValues(row.record, field).some(
            (value) => String(value ?? "").slice(0, 10) <= query,
          );
        }
        return matchFieldValue(row.record, key, query);
      }),
    );
  });
  const visibleRowIds = createMemo(() => filteredRows().map((row) => row.id));
  const allVisibleSelected = createMemo(() => {
    const visible = visibleRowIds();
    const selected = vm().selection.selected;
    return visible.length > 0 && visible.every((id) => selected.includes(id));
  });
  const someVisibleSelected = createMemo(() => {
    const visible = visibleRowIds();
    const selected = vm().selection.selected;
    return !allVisibleSelected() && visible.some((id) => selected.includes(id));
  });

  function toggleRowSelection(id: string) {
    const selection = vm().selection;
    if (selection.mode === "none") {
      return;
    }
    if (selection.mode === "single") {
      if (selection.selected.includes(id)) {
        store.clearSelection();
        return;
      }
      store.select([id]);
      return;
    }
    store.toggleSelect(id);
  }

  function toggleAllVisible(checked: boolean) {
    if (vm().selection.mode !== "multi") {
      return;
    }

    const visible = visibleRowIds();
    if (checked) {
      store.select([...new Set([...vm().selection.selected, ...visible])]);
      return;
    }

    const remaining = vm().selection.selected.filter(
      (id) => !visible.includes(id),
    );
    if (remaining.length === 0) {
      store.clearSelection();
      return;
    }
    store.select(remaining);
  }

  return (
    <div>
      <ListHeader
        resourceName={props.resource.name}
        label={props.resource.meta.label}
        pluralLabel={props.resource.meta.pluralLabel}
        rowCount={filteredRows().length}
      />
      <Show when={props.error}>
        {(error) => (
          <div class="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error()}
          </div>
        )}
      </Show>
      <Show when={props.loading}>
        <div class="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span class="size-2 rounded-full bg-primary/60 animate-pulse" />
          {t("list.loading")}
        </div>
      </Show>
      <ListSearch
        fields={vm().search.fields}
        initialQuery={vm().search.query}
        onSearch={(q) => store.setSearch(q)}
      />
      <ListNamedFilters
        filters={vm().namedFilters}
        onSelect={(id) => store.setNamedFilter(id)}
      />
      <ListFieldFilters
        filters={vm().filters}
        onSearch={(filters) => setFieldFilters(filters)}
      />
      <ListTable
        resourceName={props.resource.name}
        columns={vm().columns}
        rows={filteredRows()}
        currentSort={vm().currentSort}
        clickAction={vm().clickAction}
        selectionMode={vm().selection.mode}
        selectedIds={vm().selection.selected}
        allVisibleSelected={allVisibleSelected()}
        someVisibleSelected={someVisibleSelected()}
        onSort={(field, dir) => store.setSort(field, dir)}
        onToggleRow={toggleRowSelection}
        onToggleAll={toggleAllVisible}
      />
      <ListSelectionInfo
        mode={vm().selection.mode}
        selectedCount={vm().selection.selected.length}
      />
      <ListSelectionActions
        actions={vm().selectionActions}
        selectedCount={vm().selection.selected.length}
        onAction={(action) =>
          alert(
            `Action: ${action.label} (${vm().selection.selected.length} selected)`,
          )
        }
      />
      <ListPageActions
        actions={vm().pageActions}
        onAction={(action) => alert(`Action: ${action.label}`)}
      />
      <ListPagination
        page={props.pagination.page}
        perPage={props.pagination.perPage}
        total={props.pagination.total}
        onPageChange={props.pagination.onPageChange}
      />
    </div>
  );
}

function matchFieldValue(
  record: Record<string, unknown>,
  path: string,
  query: string,
): boolean {
  return resolvePathValues(record, path).some((value) => {
    if (query === "true") return value === true;
    if (query === "false") return value === false;

    if (/^\d{4}-\d{2}-\d{2}$/.test(query)) {
      return String(value ?? "").startsWith(query);
    }

    return String(value ?? "")
      .toLowerCase()
      .includes(query.toLowerCase());
  });
}
