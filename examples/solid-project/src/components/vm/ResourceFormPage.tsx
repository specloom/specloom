import { A } from "@solidjs/router"
import { createMemo, createSignal, For, Show } from "solid-js"
import { useSpecloom, createFormStore } from "@specloom/solidjs"
import { generateMockData } from "~/admin/mock-data"
import { FieldRenderer } from "~/admin/field-registry"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

export function ResourceNewPage(props: { resource: string }) {
  return <ResourceFormInner resource={props.resource} mode="create" />
}

export function ResourceEditPage(props: { resource: string; id: string }) {
  return <ResourceFormInner resource={props.resource} mode="edit" id={props.id} />
}

function ResourceFormInner(props: {
  resource: string
  mode: "create" | "edit"
  id?: string
}) {
  const client = useSpecloom()
  const spec = client.spec
  const resource = createMemo(() => spec.resources[props.resource])

  if (!resource()) {
    return <div class="text-sm text-muted-foreground">Unknown resource: {props.resource}</div>
  }

  const keyField = createMemo(() => {
    const fields = resource().fields
    for (const f of Object.values(fields)) {
      if (f.key) return f.name
    }
    return "id"
  })

  const initialValues = createMemo(() => {
    if (props.mode === "create") return undefined
    const data = generateMockData(spec, props.resource)
    return data.find((r) => r[keyField()] === props.id)
  })

  // Store is recreated when resource/mode/id changes
  const store = createMemo(() =>
    createFormStore({
      client,
      resource: props.resource,
      mode: props.mode,
      values: initialValues(),
    })
  )
  const vm = createMemo(() => store().view())
  const snapshot = createMemo(() => store().snapshot())
  const [hasValidated, setHasValidated] = createSignal(false)

  if (props.mode === "edit" && !initialValues()) {
    return <div class="text-sm text-muted-foreground">Record not found: {props.id}</div>
  }

  const handleFieldChange = (name: string, value: unknown) => {
    store().setValue(name, value)
    if (hasValidated()) {
      store().validate()
    }
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    setHasValidated(true)
    const result = store().validate()
    if (!result.valid) {
      console.log("Validation failed:", result)
      return
    }
    const payload = store().serialize()
    console.log("Submit payload:", JSON.stringify(payload, null, 2))
    alert("Submitted! Check console for payload.")
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

      <h1 class="text-2xl font-bold mb-6">
        {props.mode === "create" ? "New" : "Edit"} {resource().meta.label}
      </h1>

      <form onSubmit={handleSubmit} class="space-y-8 max-w-2xl">
        <Show when={snapshot().formErrors.length > 0}>
          <Alert variant="destructive">
            <AlertTitle>Validation failed</AlertTitle>
            <AlertDescription>
              <ul class="list-disc pl-5">
                <For each={snapshot().formErrors}>
                  {(error) => <li>{error}</li>}
                </For>
              </ul>
            </AlertDescription>
          </Alert>
        </Show>

        <For each={vm().sections}>
          {(section) => (
            <div>
              <h2 class="text-lg font-semibold mb-4">{section.label}</h2>
              <div class="space-y-4">
                <For each={section.fields}>
                  {(field) => (
                    <Show when={field.visible && !field.hidden}>
                      <FieldRenderer
                        name={field.name}
                        label={field.label}
                        value={field.value}
                        fieldType={field.type}
                        widget={field.ui.widget}
                        required={field.required}
                        readonly={field.readonly}
                        disabled={field.disabled}
                        errors={field.errors}
                        placeholder={field.ui.placeholder}
                        help={field.ui.help}
                        options={field.options?.map((o) => ({
                          value: o.value,
                          label: o.label,
                        }))}
                        onChange={(v) => handleFieldChange(field.name, v)}
                      />
                    </Show>
                  )}
                </For>
              </div>
              <Separator class="mt-6" />
            </div>
          )}
        </For>

        {/* Fields without section */}
        <Show when={vm().fields.some((f) => !f.ui.section && f.visible && !f.hidden)}>
          <div class="space-y-4">
            <For each={vm().fields.filter((f) => !f.ui.section && f.visible && !f.hidden)}>
              {(field) => (
                <FieldRenderer
                  name={field.name}
                  label={field.label}
                  value={field.value}
                  fieldType={field.type}
                  widget={field.ui.widget}
                  required={field.required}
                  readonly={field.readonly}
                  disabled={field.disabled}
                  errors={field.errors}
                  placeholder={field.ui.placeholder}
                  help={field.ui.help}
                  options={field.options?.map((o) => ({
                    value: o.value,
                    label: o.label,
                  }))}
                  onChange={(v) => handleFieldChange(field.name, v)}
                />
              )}
            </For>
          </div>
        </Show>

        <div class="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={!vm().isValid && vm().isDirty}>
            {props.mode === "create" ? "Create" : "Save"}
          </Button>
          <A href={`/resources/${props.resource}`}>
            <Button variant="outline" type="button">Cancel</Button>
          </A>
          <Show when={vm().isDirty}>
            <span class="text-sm text-muted-foreground">Unsaved changes</span>
          </Show>
        </div>
      </form>

      {/* Actions */}
      <Show when={vm().actions.length > 0}>
        <div class="mt-6 flex gap-2">
          <For each={vm().actions}>
            {(action) => (
              <Show when={action.visible}>
                <Button
                  variant={action.prominence === "danger" ? "destructive" : "outline"}
                  size="sm"
                  disabled={action.disabled}
                  onClick={() => alert(`Action: ${action.label}`)}
                >
                  {action.label}
                </Button>
              </Show>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}
