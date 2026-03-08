import { A } from "@solidjs/router"
import { createMemo, For, Show } from "solid-js"
import { useSpecloom, createListStore, type SolidListStore } from "@specloom/solidjs"
import { generateMockData } from "~/admin/mock-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { TextField, TextFieldInput } from "~/components/ui/text-field"
import { Button } from "~/components/ui/button"

export function ResourceListPage(props: { resource: string }) {
  const client = useSpecloom()
  const spec = client.spec

  const resource = createMemo(() => spec.resources[props.resource])
  const mockData = createMemo(() => generateMockData(spec, props.resource))

  // Store is recreated when resource changes
  const store = createMemo<SolidListStore>(() =>
    createListStore({ client, resource: props.resource, data: mockData() }),
  )

  const vm = createMemo(() => store().view())

  return (
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">
            {resource().meta.pluralLabel ?? resource().meta.label}
          </h1>
          <p class="text-sm text-muted-foreground mt-1">
            {mockData().length} records
          </p>
        </div>
        <A href={`/resources/${props.resource}/new`}>
          <Button>New {resource().meta.label}</Button>
        </A>
      </div>

      {/* Search */}
      <Show when={vm().search.fields.length > 0}>
        <div class="mb-4 max-w-sm">
          <TextField
            value={vm().search.query}
            onChange={(v: string) => store().setSearch(v)}
          >
            <TextFieldInput placeholder="Search..." />
          </TextField>
        </div>
      </Show>

      {/* Named Filters */}
      <Show when={vm().namedFilters.length > 0}>
        <div class="mb-4 flex gap-2">
          <Button
            variant={vm().namedFilters.every((f) => !f.active) ? "default" : "outline"}
            size="sm"
            onClick={() => store().setNamedFilter(null)}
          >
            All
          </Button>
          <For each={vm().namedFilters}>
            {(filter) => (
              <Button
                variant={filter.active ? "default" : "outline"}
                size="sm"
                onClick={() => store().setNamedFilter(filter.active ? null : filter.id)}
              >
                {filter.label}
              </Button>
            )}
          </For>
        </div>
      </Show>

      {/* Table */}
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <For each={vm().columns}>
                {(col) => (
                  <TableHead
                    class={col.sortable ? "cursor-pointer select-none" : ""}
                    onClick={() => {
                      if (!col.sortable) return
                      const current = vm().currentSort
                      const dir =
                        current?.field === col.field && current.direction === "asc"
                          ? "desc"
                          : "asc"
                      store().setSort(col.field, dir)
                    }}
                  >
                    <span class="flex items-center gap-1">
                      {col.label}
                      <Show when={vm().currentSort?.field === col.field}>
                        <span class="text-xs">
                          {vm().currentSort?.direction === "asc" ? "↑" : "↓"}
                        </span>
                      </Show>
                    </span>
                  </TableHead>
                )}
              </For>
              <TableHead class="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <For each={vm().rows}>
              {(row) => (
                <TableRow
                  class={
                    vm().selection.selected.includes(row.id)
                      ? "bg-muted/50"
                      : ""
                  }
                >
                  <For each={vm().columns}>
                    {(col) => (
                      <TableCell>{formatCell(row.values[col.field])}</TableCell>
                    )}
                  </For>
                  <TableCell>
                    <A
                      href={`/resources/${props.resource}/${row.id}`}
                      class="text-sm text-primary hover:underline"
                    >
                      View
                    </A>
                  </TableCell>
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
      </div>

      {/* Selection info */}
      <Show when={vm().selection.mode !== "none"}>
        <div class="mt-2 text-sm text-muted-foreground">
          Selection mode: {vm().selection.mode}
          {vm().selection.selected.length > 0 &&
            ` (${vm().selection.selected.length} selected)`}
        </div>
      </Show>

      {/* Page Actions */}
      <Show when={vm().pageActions.length > 0}>
        <div class="mt-4 flex gap-2">
          <For each={vm().pageActions}>
            {(action) => (
              <Show when={action.visible}>
                <Button
                  variant={action.prominence === "primary" ? "default" : "outline"}
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

function formatCell(value: unknown): string {
  if (value == null) return "-"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleDateString()
  }
  if (Array.isArray(value)) return value.map(formatCell).join(", ")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}
