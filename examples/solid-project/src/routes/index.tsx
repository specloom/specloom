import { A } from "@solidjs/router"
import { For } from "solid-js"
import { useSpecloom } from "@specloom/solidjs"
import { specCategories } from "~/admin/runtime"
import { Badge } from "~/components/ui/badge"

export default function Dashboard() {
  const client = useSpecloom()
  const spec = client.spec

  const categories = () => {
    const seen = new Set<string>()
    return Object.entries(specCategories).map(([category, resources]) => {
      const unique = resources.filter((r) => !seen.has(r))
      unique.forEach((r) => seen.add(r))
      return { category, resources: unique }
    }).filter((g) => g.resources.length > 0)
  }

  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Spec Catalog</h1>
      <div class="space-y-8">
        <For each={categories()}>
          {(group) => (
            <div>
              <h2 class="text-lg font-semibold mb-3 text-muted-foreground">{group.category}</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <For each={group.resources}>
                  {(resourceName) => {
                    const resource = spec.resources[resourceName]
                    if (!resource) return null
                    const fieldCount = Object.keys(resource.fields).length
                    const hasRules = resource.rules.length > 0
                    const hasActions = resource.views.list.pageActions.length > 0 || resource.views.list.rowActions.length > 0
                    return (
                      <A
                        href={`/resources/${resourceName}`}
                        class="block rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
                      >
                        <div class="flex items-center justify-between mb-2">
                          <h3 class="font-semibold">
                            {resource.meta.pluralLabel ?? resource.meta.label}
                          </h3>
                          <Badge variant="secondary">{fieldCount} fields</Badge>
                        </div>
                        <p class="text-sm text-muted-foreground mb-3">
                          {resource.meta.label} resource
                        </p>
                        <div class="flex gap-2 flex-wrap">
                          {resource.views.list.enabled && <Badge variant="outline">List</Badge>}
                          {resource.views.form.enabled && <Badge variant="outline">Form</Badge>}
                          {resource.views.show.enabled && <Badge variant="outline">Show</Badge>}
                          {hasRules && <Badge variant="outline">Rules</Badge>}
                          {hasActions && <Badge variant="outline">Actions</Badge>}
                        </div>
                      </A>
                    )
                  }}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
