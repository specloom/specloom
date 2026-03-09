import { A } from "@solidjs/router";
import { For } from "solid-js";
import { resourceCatalogGroups } from "~/admin/resource-catalog";
import { Badge } from "~/components/ui/badge";

export default function Dashboard() {
  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Spec Catalog</h1>
      <div class="space-y-8">
        <For each={resourceCatalogGroups}>
          {(group) => (
            <div>
              <h2 class="text-lg font-semibold mb-3 text-muted-foreground">
                {group.category}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <For each={group.resources}>
                  {(resource) => (
                    <A
                      href={`/resources/${resource.name}`}
                      class="block rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="font-semibold">
                          {resource.pluralLabel ?? resource.label}
                        </h3>
                        <Badge variant="secondary">
                          {resource.fieldCount} fields
                        </Badge>
                      </div>
                      <p class="text-sm text-muted-foreground mb-3">
                        {resource.label} resource
                      </p>
                      <div class="flex gap-2 flex-wrap">
                        {resource.views.list && (
                          <Badge variant="outline">List</Badge>
                        )}
                        {resource.views.form && (
                          <Badge variant="outline">Form</Badge>
                        )}
                        {resource.views.show && (
                          <Badge variant="outline">Show</Badge>
                        )}
                        {resource.hasRules && (
                          <Badge variant="outline">Rules</Badge>
                        )}
                        {resource.hasActions && (
                          <Badge variant="outline">Actions</Badge>
                        )}
                      </div>
                    </A>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
