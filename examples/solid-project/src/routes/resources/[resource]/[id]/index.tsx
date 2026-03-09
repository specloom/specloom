import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import { loadResource } from "~/admin/resource-catalog";
import { ResourceShowPage } from "~/components/vm/ResourceShowPage";

export default function ResourceShow() {
  const params = useParams();
  const [resource] = createResource(() => params.resource!, loadResource);

  return (
    <Show
      when={resource()}
      fallback={
        <div class="text-sm text-muted-foreground">Loading resource...</div>
      }
      keyed
    >
      {(resolvedResource) => (
        <ResourceShowPage resource={resolvedResource} id={params.id!} />
      )}
    </Show>
  );
}
