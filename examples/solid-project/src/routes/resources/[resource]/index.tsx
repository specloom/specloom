import { useParams, useSearchParams } from "@solidjs/router";
import { useSpecloom, useDataProvider } from "@specloom/solidjs";
import { createListStore, type SolidListStore } from "@specloom/solidjs";
import { createResource, createEffect, on, Show } from "solid-js";
import { ResourceListPage } from "~/components/vm/ResourceListPage";

export default function ResourceList() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const runtime = useSpecloom();
  const dataProvider = useDataProvider()!;

  const [resource] = createResource(
    () => params.resource,
    (name) => runtime.resolveResource(name),
  );

  const defaultSort = () => resource()?.views.list.defaultSort;
  const sortField = () =>
    String(searchParams.sort || defaultSort()?.field || "id");
  const sortOrder = () =>
    (searchParams.order || defaultSort()?.direction || "asc") as "asc" | "desc";
  const perPage = () =>
    Number(searchParams.perPage) || resource()?.meta.pageSize || 25;

  const filterExpr = () => {
    const raw = searchParams.filter;
    if (!raw) return {};
    try {
      return JSON.parse(String(raw));
    } catch {
      return {};
    }
  };

  const listParams = () => ({
    pagination: {
      page: Number(searchParams.page) || 1,
      perPage: perPage(),
    },
    sort: { field: sortField(), order: sortOrder() },
    filter: filterExpr(),
  });

  const [data] = createResource(
    () => {
      const r = resource();
      if (!r) return undefined;
      return { resource: r, params: listParams() };
    },
    (args) =>
      dataProvider.getList<Record<string, unknown>>(
        args.resource.name,
        args.params,
      ),
  );

  // Store is created once per resource, wrapped once with URL sync
  let wrappedStore: SolidListStore | undefined;
  let currentResource: string | undefined;

  const getStore = () => {
    const r = resource();
    if (!r) return undefined;

    if (!wrappedStore || currentResource !== r.name) {
      currentResource = r.name;
      const base = createListStore({
        resource: r,
        runtime,
        data: data()?.data ?? [],
        sort: searchParams.sort
          ? { field: sortField(), direction: sortOrder() }
          : undefined,
        searchQuery: String(searchParams.q || ""),
        activeFilter: searchParams.nf ? String(searchParams.nf) : null,
      });
      wrappedStore = urlSyncedStore(base, setSearchParams);
    }

    return wrappedStore;
  };

  // Sync data from server into store
  createEffect(
    on(
      () => data()?.data,
      (records) => {
        if (records && wrappedStore) {
          wrappedStore.setData(records);
        }
      },
      { defer: true },
    ),
  );

  return (
    <Show
      when={!resource.loading && !data.loading && getStore() && resource()}
      fallback={
        <div class="text-sm text-muted-foreground">
          {resource.error ?? data.error
            ? `Error: ${resource.error ?? data.error}`
            : "Loading resource..."}
        </div>
      }
    >
      <ResourceListPage
        store={getStore()!}
        resource={resource()!}
      />
    </Show>
  );
}

type SetSearchParams = ReturnType<typeof useSearchParams>[1];

function urlSyncedStore(
  base: SolidListStore,
  setSearchParams: SetSearchParams,
): SolidListStore {
  let searchDebounce: ReturnType<typeof setTimeout> | undefined;

  return {
    ...base,
    setSort(field, direction) {
      base.setSort(field, direction);
      setSearchParams({ sort: field, order: direction });
    },
    setSearch(query) {
      base.setSearch(query);
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        setSearchParams({ q: query || undefined });
      }, 300);
    },
    setNamedFilter(id) {
      base.setNamedFilter(id);
      setSearchParams({ nf: id || undefined });
    },
  };
}
