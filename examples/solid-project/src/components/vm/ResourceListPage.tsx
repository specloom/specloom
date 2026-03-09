import type { CompiledResource } from "@specloom/spec";
import type { SolidListStore } from "@specloom/solidjs";
import { createMemo, createSignal } from "solid-js";
import { ListHeader } from "~/components/vm/list/ListHeader";
import { ListSearch } from "~/components/vm/list/ListSearch";
import { ListNamedFilters } from "~/components/vm/list/ListNamedFilters";
import { ListFieldFilters } from "~/components/vm/list/ListFieldFilters";
import { ListTable } from "~/components/vm/list/ListTable";
import {
  ListSelectionInfo,
  ListPageActions,
} from "~/components/vm/list/ListActions";

export function ResourceListPage(props: {
  store: SolidListStore;
  resource: CompiledResource;
}) {
  const store = props.store;
  const vm = () => store.view();
  const [fieldFilters, setFieldFilters] = createSignal<Record<string, string>>({});

  const filteredRows = createMemo(() => {
    const filters = fieldFilters();
    const active = Object.entries(filters).filter(([, v]) => v.trim() !== "");
    if (active.length === 0) return vm().rows;
    return vm().rows.filter((row) =>
      active.every(([key, query]) => {
        if (key.endsWith("__gte")) {
          const field = key.slice(0, -5);
          return String(row.record[field] ?? "") >= query;
        }
        if (key.endsWith("__lte")) {
          const field = key.slice(0, -5);
          return String(row.record[field] ?? "").slice(0, 10) <= query;
        }
        return matchFieldValue(row.record[key], query);
      }),
    );
  });

  return (
    <div>
      <ListHeader
        resourceName={props.resource.name}
        label={props.resource.meta.label}
        pluralLabel={props.resource.meta.pluralLabel}
        rowCount={filteredRows().length}
      />
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
        columns={vm().columns}
        onSearch={(filters) => setFieldFilters(filters)}
      />
      <ListTable
        resourceName={props.resource.name}
        columns={vm().columns}
        rows={filteredRows()}
        currentSort={vm().currentSort}
        clickAction={vm().clickAction}
        selectedIds={vm().selection.selected}
        onSort={(field, dir) => store.setSort(field, dir)}
      />
      <ListSelectionInfo
        mode={vm().selection.mode}
        selectedCount={vm().selection.selected.length}
      />
      <ListPageActions
        actions={vm().pageActions}
        onAction={(action) => alert(`Action: ${action.label}`)}
      />
    </div>
  );
}

function matchFieldValue(value: unknown, query: string): boolean {
  // boolean: exact match "true" / "false"
  if (query === "true") return value === true;
  if (query === "false") return value === false;

  // date: prefix match (e.g. "2026-03-09" matches "2026-03-09T...")
  if (/^\d{4}-\d{2}-\d{2}$/.test(query)) {
    return String(value ?? "").startsWith(query);
  }

  // select / text: case-insensitive contains
  return String(value ?? "").toLowerCase().includes(query.toLowerCase());
}
