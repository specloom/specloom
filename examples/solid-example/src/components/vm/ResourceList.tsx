import { createSignal, createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
import type { ListFieldVM, RowVM, ListVM } from "specloom";
import type { ResourceListProps } from "./list/types";
import { defaultActionHandler } from "./list/utils";
import { ListFilterTabs } from "./list/ListFilterTabs";
import { ListToolbar } from "./list/ListToolbar";
import { ListTable } from "./list/ListTable";
import { ListPagination } from "./list/ListPagination";

export type { ResourceListProps } from "./list/types";

export function ResourceList(props: ResourceListProps) {
  const navigate = useNavigate();
  const handleAction = props.onAction ?? defaultActionHandler(props.basePath, navigate);

  const [hiddenColumns, setHiddenColumns] = createSignal<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set());
  const [activeFilterId, setActiveFilterId] = createSignal<string | null>(null);

  // Apply named filter to VM (immutable update)
  const vm = createMemo<ListVM>(() => {
    const base = props.vm;
    const filterId = activeFilterId();
    if (!filterId) return base.clearFilters();
    // Activate only the selected filter, deactivate others
    let updated = base.clearFilters();
    updated = updated.setFilterActive(filterId, true);
    return updated;
  });

  const filteredRows = createMemo(() => vm().filterRows());

  const visibleFields = () =>
    vm().fields.filter((f: ListFieldVM) => !hiddenColumns().has(f.name));

  const handleSort = (field: ListFieldVM) => {
    if (!field.sortable || !props.onSortChange) return;
    const current = vm().sortOrder(field.name);
    const next: "asc" | "desc" = current === "asc" ? "desc" : "asc";
    props.onSortChange(field.name, next);
  };

  const toggleColumn = (name: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const rows = filteredRows();
    const allSelected = rows.length > 0 && rows.every((r: RowVM) => selectedIds().has(r.id));
    if (allSelected) {
      setSelectedIds(new Set<string>());
    } else {
      setSelectedIds(new Set<string>(rows.map((r: RowVM) => r.id)));
    }
  };

  const isAllSelected = () => {
    const rows = filteredRows();
    return rows.length > 0 && rows.every((r: RowVM) => selectedIds().has(r.id));
  };

  const isIndeterminate = () => {
    const rows = filteredRows();
    const sel = selectedIds();
    const count = rows.filter((r: RowVM) => sel.has(r.id)).length;
    return count > 0 && count < rows.length;
  };

  return (
    <div class="space-y-4">
      <ListFilterTabs
        vm={vm}
        activeFilterId={activeFilterId}
        onFilterChange={setActiveFilterId}
      />

      <ListToolbar
        vm={vm}
        total={props.total}
        filteredCount={filteredRows().length}
        selectedIds={selectedIds}
        hiddenColumns={hiddenColumns}
        onSearch={props.onSearchChange}
        onToggleColumn={toggleColumn}
        onAction={handleAction}
        onBulkAction={props.onBulkAction}
      />

      <ListTable
        vm={vm}
        rows={filteredRows}
        basePath={props.basePath}
        visibleFields={visibleFields}
        selectedIds={selectedIds}
        onSort={handleSort}
        onToggleSelect={toggleSelect}
        onToggleAll={toggleAll}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
        onAction={handleAction}
      />

      <ListPagination
        total={props.total}
        page={props.page}
        perPage={props.perPage}
        onPageChange={props.onPageChange}
      />
    </div>
  );
}
