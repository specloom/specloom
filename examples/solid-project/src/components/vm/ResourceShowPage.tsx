import { A } from "@solidjs/router"
import { createMemo, For, Show } from "solid-js"
import { useSpecloom } from "@specloom/solidjs"
import { generateMockData } from "~/admin/mock-data"
import { Separator } from "~/components/ui/separator"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"

export function ResourceShowPage(props: { resource: string; id: string }) {
  const client = useSpecloom()
  const spec = client.spec
  const resource = createMemo(() => spec.resources[props.resource])

  const keyField = () => {
    for (const f of Object.values(resource().fields)) {
      if (f.key) return f.name
    }
    return "id"
  }

  const record = createMemo(() => {
    const data = generateMockData(spec, props.resource)
    return data.find((r) => r[keyField()] === props.id) ?? data[0]
  })

  const showSections = createMemo(() => resource().views.show.sections)

  return (
    <div>
      <div class="flex items-center gap-4 mb-6">
        <A
          href={`/resources/${props.resource}`}
          class="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {resource().meta.pluralLabel ?? resource().meta.label}
        </A>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">
          {resource().meta.label}: {props.id}
        </h1>
        <A href={`/resources/${props.resource}/${props.id}/edit`}>
          <Button variant="outline">Edit</Button>
        </A>
      </div>

      <div class="max-w-2xl space-y-6">
        <Show
          when={showSections().length > 0}
          fallback={
            <FieldGrid record={record()} fields={Object.values(resource().fields)} />
          }
        >
          <For each={showSections()}>
            {(section) => (
              <div>
                <h2 class="text-lg font-semibold mb-3">{section.label}</h2>
                <FieldGrid
                  record={record()}
                  fields={section.fields.map((name) => resource().fields[name]).filter(Boolean)}
                />
                <Separator class="mt-4" />
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  )
}

function FieldGrid(props: {
  record: Record<string, unknown>
  fields: Array<{ name: string; ui: { label?: string; visibleIn: { show: boolean }; appearance?: string } }>
}) {
  const visibleFields = () => props.fields.filter((f) => f.ui.visibleIn.show)

  return (
    <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <For each={visibleFields()}>
        {(field) => (
          <div>
            <dt class="text-sm font-medium text-muted-foreground">{field.ui.label ?? field.name}</dt>
            <dd class="mt-1 text-sm">
              <Show
                when={field.ui.appearance === "badge"}
                fallback={formatShow(props.record[field.name])}
              >
                <Badge variant="secondary">
                  {formatShow(props.record[field.name])}
                </Badge>
              </Show>
            </dd>
          </div>
        )}
      </For>
    </dl>
  )
}

function formatShow(value: unknown): string {
  if (value == null) return "-"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString()
  }
  if (Array.isArray(value)) return value.map(formatShow).join(", ")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}
