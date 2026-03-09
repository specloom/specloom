import { useParams } from "@solidjs/router";
import { useListPage } from "@specloom/solidjs";
import { Show } from "solid-js";
import { ResourceListPage } from "~/components/vm/ResourceListPage";

export default function ResourceList() {
  const params = useParams();
  const { resource, store, loading, error } = useListPage({
    resource: () => params.resource!,
  });

  return (
    <Show
      when={!loading() && !error() && store() && resource()}
      fallback={
        <div class="text-sm text-muted-foreground">
          {error() ? `Error: ${error()}` : "Loading resource..."}
        </div>
      }
    >
      <ResourceListPage store={store()!} resource={resource()!} />
    </Show>
  );
}
