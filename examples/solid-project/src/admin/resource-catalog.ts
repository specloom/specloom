import type { CompiledSpec } from "@specloom/spec"
import { validateSpec } from "specloom"

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
    name: "Department",
    category: "Basic",
    specPath: "../../../specs/generated/10-basic/spec.json",
    label: "Department",
    pluralLabel: "Departments",
    fieldCount: 2,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "Tag",
    category: "Basic",
    specPath: "../../../specs/generated/10-basic/spec.json",
    label: "Tag",
    pluralLabel: "Tags",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "Member",
    category: "Basic",
    specPath: "../../../specs/generated/10-basic/spec.json",
    label: "Member",
    pluralLabel: "Members",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "BasicScalarExample",
    category: "Basic",
    specPath: "../../../specs/generated/10-basic/spec.json",
    label: "Basic Scalar",
    pluralLabel: "Basic Scalars",
    fieldCount: 5,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "UiMetadataExample",
    category: "Basic",
    specPath: "../../../specs/generated/10-basic/spec.json",
    label: "UI Metadata",
    pluralLabel: "UI Metadata",
    fieldCount: 5,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "LifecycleFlagsExample",
    category: "Basic",
    specPath: "../../../specs/generated/10-basic/spec.json",
    label: "Lifecycle Flags",
    pluralLabel: "Lifecycle Flags",
    fieldCount: 5,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "FieldValidationExample",
    category: "Validation",
    specPath: "../../../specs/generated/20-validation/spec.json",
    label: "Field Validation",
    pluralLabel: "Field Validations",
    fieldCount: 5,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "ConditionalValidationExample",
    category: "Validation",
    specPath: "../../../specs/generated/20-validation/spec.json",
    label: "Conditional Validation",
    pluralLabel: "Conditional Validations",
    fieldCount: 7,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "ModelRulesExample",
    category: "Validation",
    specPath: "../../../specs/generated/20-validation/spec.json",
    label: "Model Rules",
    pluralLabel: "Model Rules",
    fieldCount: 9,
    hasRules: true,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "FilterOperatorsExample",
    category: "Filters & Options",
    specPath: "../../../specs/generated/30-filters-options/spec.json",
    label: "Filter Operators",
    pluralLabel: "Filter Operators",
    fieldCount: 4,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "NamedFiltersExample",
    category: "Filters & Options",
    specPath: "../../../specs/generated/30-filters-options/spec.json",
    label: "Named Filters",
    pluralLabel: "Named Filters",
    fieldCount: 6,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "StaticOptionsExample",
    category: "Filters & Options",
    specPath: "../../../specs/generated/30-filters-options/spec.json",
    label: "Static Options",
    pluralLabel: "Static Options",
    fieldCount: 4,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "OptionSourceExample",
    category: "Filters & Options",
    specPath: "../../../specs/generated/30-filters-options/spec.json",
    label: "Option Source",
    pluralLabel: "Option Sources",
    fieldCount: 4,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "BelongsToRelationExample",
    category: "Relations",
    specPath: "../../../specs/generated/40-relations/spec.json",
    label: "Belongs To Relation",
    pluralLabel: "Belongs To Relations",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "HasManyRelationExample",
    category: "Relations",
    specPath: "../../../specs/generated/40-relations/spec.json",
    label: "Has Many Relation",
    pluralLabel: "Has Many Relations",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "ManyToManyRelationExample",
    category: "Relations",
    specPath: "../../../specs/generated/40-relations/spec.json",
    label: "Many To Many Relation",
    pluralLabel: "Many To Many Relations",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "Address",
    category: "Nested",
    specPath: "../../../specs/generated/50-nested/spec.json",
    label: "Address",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "OrderLine",
    category: "Nested",
    specPath: "../../../specs/generated/50-nested/spec.json",
    label: "OrderLine",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "AttachmentCard",
    category: "Nested",
    specPath: "../../../specs/generated/50-nested/spec.json",
    label: "AttachmentCard",
    fieldCount: 2,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "NestedOneInlineExample",
    category: "Nested",
    specPath: "../../../specs/generated/50-nested/spec.json",
    label: "Nested One",
    pluralLabel: "Nested Ones",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "NestedManyTableExample",
    category: "Nested",
    specPath: "../../../specs/generated/50-nested/spec.json",
    label: "Nested Many Table",
    pluralLabel: "Nested Many Tables",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "NestedManyCardsExample",
    category: "Nested",
    specPath: "../../../specs/generated/50-nested/spec.json",
    label: "Nested Many Cards",
    pluralLabel: "Nested Many Cards",
    fieldCount: 3,
    hasRules: false,
    hasActions: false,
    views: { list: true, form: true, show: true },
  },
  {
    name: "PageActionCatalog",
    category: "Actions",
    specPath: "../../../specs/generated/60-actions/spec.json",
    label: "Page Action Catalog",
    pluralLabel: "Page Action Catalog",
    fieldCount: 3,
    hasRules: false,
    hasActions: true,
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

export async function loadResourceSpec(resourceName: string): Promise<CompiledSpec> {
  const entry = resourceCatalogByName[resourceName]
  if (!entry) {
    return { version: "1", resources: {} }
  }

  const loader = specModules[entry.specPath]
  if (!loader) {
    throw new Error(`Spec module not found: ${entry.specPath}`)
  }

  const source = validateSpec((await loader()) as ResourceSpecModule)
  return scopeSpecToResource(source, resourceName)
}

function scopeSpecToResource(spec: CompiledSpec, resourceName: string): CompiledSpec {
  const resource = spec.resources[resourceName]

  return {
    version: spec.version,
    resources: resource ? { [resourceName]: resource } : {},
    ...(spec.inputs ? { inputs: spec.inputs } : {}),
  }
}
