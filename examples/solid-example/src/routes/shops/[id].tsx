import { createResource, Suspense } from "solid-js";
import { useParams } from "@solidjs/router";
import { MainLayout } from "~/components/MainLayout";
import { ResourceShow } from "~/components/vm/ResourceShow";
import { admin, dataProvider } from "~/lib/admin";

export default function ShopDetail() {
  const params = useParams<{ id: string }>();

  const [data] = createResource(
    () => params.id,
    (id) => dataProvider.getOne<Record<string, unknown>>("Shop", { id }),
  );

  const vm = () => {
    const d = data();
    if (!d) return undefined;
    return admin.show("Shop", { data: d });
  };

  return (
    <MainLayout title="店舗詳細">
      <Suspense>
        {vm() && <ResourceShow vm={vm()!} basePath="/shops" />}
      </Suspense>
    </MainLayout>
  );
}
