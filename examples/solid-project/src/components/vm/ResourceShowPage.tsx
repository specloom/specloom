import { A } from "@solidjs/router"
import { createMemo, For, Show } from "solid-js"
import { useSpecloom } from "@specloom/solidjs"
import { createShowVM, type ShowFieldVM } from "specloom"
import { generateMockData } from "~/admin/mock-data"
import { Separator } from "~/components/ui/separator"
import { Button } from "~/components/ui/button"
import { SpecFieldValue } from "~/components/vm/SpecValue"

export function ResourceShowPage(props: { resource: string; id: string }) {
  const client = useSpecloom()
  const spec = client.spec
  const resource = createMemo(() => spec.resources[props.resource])

  if (!resource()) {
    return <div class="text-sm text-muted-foreground">Unknown resource: {props.resource}</div>
  }

  const keyField = () => {
    for (const f of Object.values(resource().fields)) {
      if (f.key) return f.name
    }
    return "id"
  }

  const record = createMemo(() => {
    const data = generateMockData(spec, props.resource)
    return data.find((r) => r[keyField()] === props.id)
  })

  const vm = createMemo(() => {
    const current = record()
    if (!current) return undefined
    return createShowVM(spec, props.resource, {
      context: client.resolveContext(),
      record: current,
    })
  })

  if (!record() || !vm()) {
    return <div class="text-sm text-muted-foreground">Record not found: {props.id}</div>
  }

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
          when={vm()!.sections.length > 0}
          fallback={
            <FieldGrid fields={vm()!.fields} />
          }
        >
          <For each={vm()!.sections}>
            {(section) => (
              <div>
                <h2 class="text-lg font-semibold mb-3">{section.label}</h2>
                <FieldGrid fields={section.fields} />
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
  fields: ShowFieldVM[]
}) {
  return (
    <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <For each={props.fields}>
        {(field) => (
          <div>
            <dt class="text-sm font-medium text-muted-foreground">{field.label}</dt>
            <dd class="mt-1 text-sm">
              <SpecFieldValue field={field} value={field.value} />
            </dd>
          </div>
        )}
      </For>
    </dl>
  )
}
