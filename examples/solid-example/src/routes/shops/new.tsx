import { useNavigate } from "@solidjs/router";
import { MainLayout } from "~/components/MainLayout";
import { ResourceForm } from "~/components/vm/ResourceForm";
import { admin, dataProvider } from "~/lib/admin";

export default function ShopNew() {
  const navigate = useNavigate();
  const vm = admin.form("Shop", { mode: "create" });

  return (
    <MainLayout title="店舗作成">
      <ResourceForm
        vm={vm}
        basePath="/shops"
        onSubmit={async (values) => {
          await dataProvider.create("Shop", { data: values });
          navigate("/shops");
        }}
      />
    </MainLayout>
  );
}
