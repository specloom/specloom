import { createResource, Suspense } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { MainLayout } from "~/components/MainLayout";
import { ResourceForm } from "~/components/vm/ResourceForm";
import { admin, dataProvider } from "~/lib/admin";

export default function ShopEdit() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data] = createResource(
    () => params.id,
    (id) => dataProvider.getOne<Record<string, unknown>>("Shop", { id }),
  );

  const vm = () => {
    const d = data();
    if (!d) return undefined;
    return admin.form("Shop", { mode: "edit", data: d });
  };

  return (
    <MainLayout title="店舗編集">
      <Suspense>
        {vm() && (
          <ResourceForm
            vm={vm()!}
            basePath="/shops"
            onSubmit={async (values) => {
              await dataProvider.update("Shop", { id: params.id, data: values });
              navigate(`/shops/${params.id}`);
            }}
          />
        )}
      </Suspense>
    </MainLayout>
  );
}
