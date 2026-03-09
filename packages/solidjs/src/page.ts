import type { CompiledResource } from "@specloom/spec";
import type { ListResult } from "@specloom/data-provider";
import { createMemo, createResource, type Accessor } from "solid-js";
import { useSpecloom } from "./context.js";
import { createListStore, type SolidListStore } from "./list.js";
import type { Context } from "specloom";

export interface UseListPageArgs {
  resource: string | Accessor<string>;
  context?: Context;
}

export interface UseListPageResult {
  resource: Accessor<CompiledResource | undefined>;
  data: Accessor<ListResult<Record<string, unknown>> | undefined>;
  store: Accessor<SolidListStore | undefined>;
  loading: Accessor<boolean>;
  error: Accessor<unknown>;
}

export function useListPage(args: UseListPageArgs): UseListPageResult {
  const runtime = useSpecloom();
  const resourceName = () =>
    typeof args.resource === "function" ? args.resource() : args.resource;

  const [resource] = createResource(resourceName, (name) =>
    Promise.resolve(runtime.resolveResource(name)),
  );

  const [data] = createResource(
    () => {
      const r = resource();
      return r && runtime.dataProvider ? r : undefined;
    },
    (r) =>
      runtime.dataProvider!.getList<Record<string, unknown>>(r.name, {
        pagination: { page: 1, perPage: 25 },
        sort: { field: "id", order: "asc" },
        filter: {},
      }),
  );

  const store = createMemo(() => {
    const r = resource();
    const d = data();
    if (!r) return undefined;
    return createListStore({
      resource: r,
      runtime,
      context: args.context,
      data: d?.data ?? [],
    });
  });

  return {
    resource: () => resource(),
    data: () => data(),
    store,
    loading: () => resource.loading || data.loading,
    error: () => resource.error ?? data.error,
  };
}
