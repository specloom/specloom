import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import { loadResource } from "~/admin/resource-catalog";
import { ResourceEditPage } from "~/components/vm/ResourceFormPage";

export default function ResourceEdit() {
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
        <ResourceEditPage resource={resolvedResource} id={params.id!} />
      )}
    </Show>
  );
}
