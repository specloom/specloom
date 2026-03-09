import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import { loadResource } from "~/admin/resource-catalog";
import { ResourceNewPage } from "~/components/vm/ResourceFormPage";

export default function ResourceNew() {
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
      {(resolvedResource) => <ResourceNewPage resource={resolvedResource} />}
    </Show>
  );
}
