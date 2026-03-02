import { createResource, Suspense } from "solid-js";
import { MainLayout } from "~/components/MainLayout";
import { ResourceList } from "~/components/vm/ResourceList";
import { admin, dataProvider } from "~/lib/admin";
import { createListParams } from "~/lib/createListParams";

export default function ShopList() {
  const { params, setPage, setSort } = createListParams({
    sort: { field: "name", order: "asc" },
  });

  const [result] = createResource(params, (p) =>
    dataProvider.getList<Record<string, unknown>>("Shop", p),
  );

  const vm = () => {
    const r = result();
    if (!r) return undefined;
    return admin.list("Shop", { data: r.data });
  };

  return (
    <MainLayout title="店舗">
      <Suspense>
        {vm() && (
          <ResourceList
            vm={vm()!}
            basePath="/shops"
            total={result()?.total}
            page={params().pagination.page}
            perPage={params().pagination.perPage}
            onPageChange={setPage}
            onSortChange={setSort}
          />
        )}
      </Suspense>
    </MainLayout>
  );
}
