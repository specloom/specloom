import { useParams, useSearchParams } from "@solidjs/router";
import { useSpecloom, useDataProvider } from "@specloom/solidjs";
import { createListStore, type SolidListStore } from "@specloom/solidjs";
import { createResource, createMemo, Show } from "solid-js";
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

  const store = createMemo(() => {
    const r = resource();
    if (!r) return undefined;
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
    return urlSyncedStore(base, setSearchParams);
  });

  return (
    <Show
      when={!resource.loading && !data.loading && store() && resource()}
      fallback={
        <div class="text-sm text-muted-foreground">
          {resource.error ?? data.error
            ? `Error: ${resource.error ?? data.error}`
            : "Loading resource..."}
        </div>
      }
    >
      <ResourceListPage store={store()!} resource={resource()!} />
    </Show>
  );
}

type SetSearchParams = ReturnType<typeof useSearchParams>[1];

function urlSyncedStore(
  base: SolidListStore,
  setSearchParams: SetSearchParams,
): SolidListStore {
  return {
    ...base,
    setSort(field, direction) {
      setSearchParams({ sort: field, order: direction });
    },
    setSearch(query) {
      setSearchParams({ q: query || undefined });
    },
    setNamedFilter(id) {
      setSearchParams({ nf: id || undefined });
    },
  };
}
