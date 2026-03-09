import { useParams } from "@solidjs/router";
import { useSpecloom } from "@specloom/solidjs";
import { createMemo, createResource, Show } from "solid-js";
import { loadResourceSpec } from "~/admin/resource-catalog";
import { ResourceShowPage } from "~/components/vm/ResourceShowPage";

export default function ResourceShow() {
  const runtime = useSpecloom();
  const params = useParams();
  const [spec] = createResource(() => params.resource!, loadResourceSpec);
  const context = createMemo(() => runtime.resolveContext());
  const currentSpec = createMemo(() => {
    const value = spec();
    return value?.resources[params.resource!] ? value : undefined;
  });

  return (
    <Show
      when={currentSpec()}
      fallback={
        <div class="text-sm text-muted-foreground">Loading resource...</div>
      }
    >
      {(resolvedSpec) => (
        <ResourceShowPage
          spec={resolvedSpec()}
          context={context()}
          resource={params.resource!}
          id={params.id!}
        />
      )}
    </Show>
  );
}
