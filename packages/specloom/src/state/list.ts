import type { CompiledResource } from "@specloom/spec";
import { applyNamedFilter } from "../filter/index.js";
import { evaluateListView } from "../evaluator/index.js";
import type { Context, ListViewModel } from "../vm/types.js";

export interface ListSort {
  field: string;
  direction: "asc" | "desc";
}

export interface ListStateSnapshot {
  resource: CompiledResource;
  context: Context;
  data: Record<string, unknown>[];
  searchQuery: string;
  activeFilter: string | null;
  selected: string[];
  sort?: ListSort;
}

export interface CreateListStateArgs {
  resource: CompiledResource;
  context?: Context;
  data: Record<string, unknown>[];
  searchQuery?: string;
  activeFilter?: string | null;
  selected?: string[];
  sort?: ListSort;
}

export interface ListState {
  snapshot(): ListStateSnapshot;
  view(): ListViewModel;
  setData(data: Record<string, unknown>[]): ListState;
  setSearch(query: string): ListState;
  setNamedFilter(id: string | null): ListState;
  setSort(field: string, direction: "asc" | "desc"): ListState;
  toggleSelect(id: string): ListState;
  select(ids: string[]): ListState;
  clearSelection(): ListState;
}

export function createListState(args: CreateListStateArgs): ListState {
  const snapshot: ListStateSnapshot = {
    resource: args.resource,
    context: args.context ?? {},
    data: args.data,
    searchQuery: args.searchQuery ?? "",
    activeFilter: args.activeFilter ?? null,
    selected: args.selected ?? [],
    sort: args.sort,
  };

  function next(patch: Partial<ListStateSnapshot>): ListState {
    return createListState({
      ...snapshot,
      ...patch,
    });
  }

  return {
    snapshot() {
      return structuredClone(snapshot);
    },
    view() {
      const filtered = filterBySearch(
        applyActiveFilter(snapshot.resource, snapshot),
        snapshot.resource.views.list.search?.fields ?? [],
        snapshot.searchQuery,
      );
      const data = sortRecords(filtered, snapshot.sort);

      return evaluateListView({
        resource: snapshot.resource,
        context: snapshot.context,
        data,
        activeFilter: snapshot.activeFilter ?? undefined,
        searchQuery: snapshot.searchQuery,
        selected: snapshot.selected,
        sort: snapshot.sort,
      });
    },
    setData(data) {
      return next({ data });
    },
    setSearch(query) {
      return next({ searchQuery: query });
    },
    setNamedFilter(id) {
      return next({ activeFilter: id });
    },
    setSort(field, direction) {
      return next({ sort: { field, direction } });
    },
    toggleSelect(id) {
      const selected = snapshot.selected.includes(id)
        ? snapshot.selected.filter((value) => value !== id)
        : [...snapshot.selected, id];
      return next({ selected });
    },
    select(ids) {
      return next({ selected: [...ids] });
    },
    clearSelection() {
      return next({ selected: [] });
    },
  };
}

function applyActiveFilter(
  resource: CompiledResource,
  snapshot: ListStateSnapshot,
): Record<string, unknown>[] {
  if (!snapshot.activeFilter) {
    return snapshot.data;
  }

  const namedFilter = resource.views.list.namedFilters.find(
    (filter) => filter.id === snapshot.activeFilter,
  );

  if (!namedFilter) {
    return snapshot.data;
  }

  return applyNamedFilter({
    data: snapshot.data,
    namedFilter,
    context: snapshot.context,
  });
}

function filterBySearch(
  data: Record<string, unknown>[],
  fields: string[],
  query: string,
): Record<string, unknown>[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed || fields.length === 0) {
    return data;
  }

  return data.filter((record) =>
    fields.some((field) =>
      String(record[field] ?? "")
        .toLowerCase()
        .includes(trimmed),
    ),
  );
}

function sortRecords(
  data: Record<string, unknown>[],
  sort?: ListSort,
): Record<string, unknown>[] {
  if (!sort) {
    return data;
  }

  return [...data].sort((left, right) => {
    const l = left[sort.field];
    const r = right[sort.field];
    if (l === r) {
      return 0;
    }
    if (l == null) {
      return 1;
    }
    if (r == null) {
      return -1;
    }
    if (l < r) {
      return sort.direction === "asc" ? -1 : 1;
    }
    return sort.direction === "asc" ? 1 : -1;
  });
}
