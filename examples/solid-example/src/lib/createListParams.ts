import { createSignal } from "solid-js";
import type { ListParams } from "@specloom/data-provider";

interface CreateListParamsOptions {
  sort?: { field: string; order: "asc" | "desc" };
  perPage?: number;
  filter?: Record<string, unknown>;
}

export function createListParams(options: CreateListParamsOptions = {}) {
  const initial: ListParams = {
    pagination: { page: 1, perPage: options.perPage ?? 50 },
    sort: options.sort ?? { field: "id", order: "asc" },
    filter: options.filter ?? {},
  };

  const [params, setParams] = createSignal<ListParams>(initial);

  return {
    params,
    setPage(page: number) {
      setParams((p) => ({ ...p, pagination: { ...p.pagination, page } }));
    },
    setSort(field: string, order: "asc" | "desc" = "asc") {
      setParams((p) => ({ ...p, sort: { field, order }, pagination: { ...p.pagination, page: 1 } }));
    },
    setFilter(filter: Record<string, unknown>) {
      setParams((p) => ({ ...p, filter, pagination: { ...p.pagination, page: 1 } }));
    },
  };
}
