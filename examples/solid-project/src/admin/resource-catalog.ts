import type { CompiledResource, CompiledSpec } from "@specloom/spec"
import { getResource, validateSpec } from "specloom"

type ResourceSpecModule = Record<string, unknown>

const specModules = import.meta.glob("../../../specs/generated/*/spec.json", {
  import: "default",
})

export interface ResourceCatalogEntry {
  name: string
  category: string
  specPath: string
  label: string
  pluralLabel?: string
  fieldCount: number
  hasRules: boolean
  hasActions: boolean
  views: {
    list: boolean
    form: boolean
    show: boolean
  }
}

export const resourceCatalog: ResourceCatalogEntry[] = [
  {
    name: "Task",
    category: "App",
    specPath: "../../../specs/generated/solid-app/spec.json",
    label: "Task",
    pluralLabel: "Tasks",
    fieldCount: 4,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
]

export const resourceCatalogByName = Object.fromEntries(
  resourceCatalog.map((resource) => [resource.name, resource]),
) as Record<string, ResourceCatalogEntry>

export const resourceCatalogGroups = Array.from(
  new Set(resourceCatalog.map((resource) => resource.category)),
).map((category) => ({
  category,
  resources: resourceCatalog.filter((resource) => resource.category === category),
}))

export async function loadResource(resourceName: string): Promise<CompiledResource | undefined> {
  const entry = resourceCatalogByName[resourceName]
  if (!entry) return undefined

  const loader = specModules[entry.specPath]
  if (!loader) {
    throw new Error(`Spec module not found: ${entry.specPath}`)
  }

  const spec = validateSpec((await loader()) as ResourceSpecModule)
  return getResource(spec, resourceName)
}
