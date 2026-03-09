import { useParams } from "@solidjs/router";
import type { ListResult } from "@specloom/data-provider";
import { useSpecloom } from "@specloom/solidjs";
import { createMemo, createResource, Show } from "solid-js";
import { generateMockData } from "~/admin/mock-data";
import { loadResourceSpec } from "~/admin/resource-catalog";
import { ResourceListPage } from "~/components/vm/ResourceListPage";

export default function ResourceList() {
  const runtime = useSpecloom();
  const params = useParams();
  const [spec] = createResource(() => params.resource!, loadResourceSpec);
  const context = createMemo(() => runtime.resolveContext());
  const currentSpec = createMemo(() => {
    const value = spec();
    return value?.resources[params.resource!] ? value : undefined;
  });
  const data = createMemo<ListResult<Record<string, unknown>> | undefined>(
    () => {
      const value = currentSpec();
      if (!value) return undefined;

      const records = generateMockData(value, params.resource!);
      return {
        data: records,
        page: 1,
        perPage: records.length,
        total: records.length,
      };
    },
  );

  return (
    <Show
      when={currentSpec()}
      fallback={
        <div class="text-sm text-muted-foreground">Loading resource...</div>
      }
    >
      {(resolvedSpec) => (
        <ResourceListPage
          spec={resolvedSpec()}
          context={context()}
          resource={params.resource!}
          data={data()!}
        />
      )}
    </Show>
  );
}
