import type {
  DecoratorContext,
  Model,
  ModelProperty,
  Type,
  Value,
} from "@typespec/compiler";
import { StateKeys } from "./lib.js";

// ============================================================
// Value Extraction Helpers
// ============================================================

/**
 * Extract primitive value from TypeSpec Value type
 */
function extractValue(val: Value | unknown): unknown {
  if (val === null || val === undefined) {
    return val;
  }

  // Check if it's a TypeSpec Value type
  if (typeof val === "object" && val !== null && "valueKind" in val) {
    const v = val as { valueKind: string; value?: unknown; values?: unknown[] };
    switch (v.valueKind) {
      case "StringValue":
        return v.value;
      case "NumericValue":
        return v.value;
      case "BooleanValue":
        return v.value;
      case "ArrayValue":
        return (v.values ?? []).map(extractValue);
      case "ObjectValue":
        return extractObjectValue(v);
      default:
        return v.value;
    }
  }

  // Check for legacy Type-based value format (entityKind: "Type")
  if (typeof val === "object" && val !== null && "entityKind" in val) {
    const t = val as { entityKind: string; kind: string; value?: unknown };
    if (t.entityKind === "Type") {
      if (t.kind === "String" || t.kind === "Number" || t.kind === "Boolean") {
        return t.value;
      }
    }
  }

  // Already a primitive value
  return val;
}

/**
 * Extract object from TypeSpec ObjectValue
 */
function extractObjectValue(
  obj:
    | { valueKind: string; properties?: Map<string, { value: Value }> }
    | unknown,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (
    typeof obj === "object" &&
    obj !== null &&
    "properties" in obj &&
    obj.properties instanceof Map
  ) {
    for (const [key, prop] of obj.properties) {
      result[key] = extractValue(prop.value);
    }
  }
  return result;
}

/**
 * Extract string value
 */
function extractString(val: unknown): string | undefined {
  const extracted = extractValue(val);
  return typeof extracted === "string" ? extracted : undefined;
}

/**
 * Extract number value
 */
function extractNumber(val: unknown): number | undefined {
  const extracted = extractValue(val);
  return typeof extracted === "number" ? extracted : undefined;
}

/**
 * Extract string array value
 */
function extractStringArray(val: unknown): string[] | undefined {
  const extracted = extractValue(val);
  if (Array.isArray(extracted)) {
    return extracted.filter((v): v is string => typeof v === "string");
  }
  return undefined;
}

// ============================================================
// Resource Decorators
// ============================================================

/**
 * @resource - Mark a model as a resource
 */
export function $resource(
  context: DecoratorContext,
  target: Model,
  name?: unknown,
) {
  const extractedName = extractString(name);
  context.program
    .stateMap(StateKeys.resource)
    .set(target, extractedName ?? target.name);
}

/**
 * @label - Set display label
 */
export function $label(
  context: DecoratorContext,
  target: Model | ModelProperty,
  label: unknown,
) {
  const extractedLabel = extractString(label);
  if (extractedLabel) {
    context.program.stateMap(StateKeys.label).set(target, extractedLabel);
  }
}

/**
 * @kind - Set field kind (text, longText, enum, relation, etc.)
 */
export function $kind(
  context: DecoratorContext,
  target: ModelProperty,
  kind: unknown,
) {
  const extractedKind = extractString(kind);
  if (extractedKind) {
    context.program.stateMap(StateKeys.kind).set(target, extractedKind);
  }
}

/**
 * @options - Set enum options
 */
export function $options(
  context: DecoratorContext,
  target: ModelProperty,
  options: unknown,
) {
  // Extract values from TypeSpec Value types
  const extracted = extractValue(options);
  const cleanOptions: { value: string; label: string }[] = [];

  if (Array.isArray(extracted)) {
    for (const opt of extracted) {
      if (opt && typeof opt === "object" && "value" in opt && "label" in opt) {
        cleanOptions.push({
          value: String(opt.value),
          label: String(opt.label),
        });
      }
    }
  }
  context.program.stateMap(StateKeys.options).set(target, cleanOptions);
}

/**
 * @relation - Define relation to another resource
 */
export function $relation(
  context: DecoratorContext,
  target: ModelProperty,
  resource: Model,
  options?: unknown,
) {
  const extracted = extractValue(options) as
    | { labelField?: string }
    | undefined;
  context.program.stateMap(StateKeys.relation).set(target, {
    resource: resource.name,
    labelField: extracted?.labelField,
  });
}

/**
 * @ui - Set UI hints
 */
export function $ui(
  context: DecoratorContext,
  target: ModelProperty | Model,
  options: unknown,
) {
  // Extract values from TypeSpec Value types
  const extracted = extractValue(options) as Record<string, unknown> | null;
  if (extracted && typeof extracted === "object") {
    context.program.stateMap(StateKeys.ui).set(target, extracted);
  }
}

/**
 * @readonly - Mark field as readonly
 */
export function $readonly(context: DecoratorContext, target: ModelProperty) {
  context.program.stateSet(StateKeys.readonly).add(target);
}

/**
 * @computed - Mark field as computed (not in DB)
 */
export function $computed(context: DecoratorContext, target: ModelProperty) {
  context.program.stateSet(StateKeys.computed).add(target);
}

/**
 * @filter - Make field filterable
 */
export function $filter(
  context: DecoratorContext,
  target: ModelProperty,
  operators?: unknown,
) {
  const extracted = extractStringArray(operators);
  context.program.stateMap(StateKeys.filter).set(target, extracted ?? true);
}

// ============================================================
// View Decorators
// ============================================================

/**
 * @view - Define a view for a resource
 */
export function $view(
  context: DecoratorContext,
  target: Model,
  resource: Model,
  viewType: unknown,
) {
  const extractedType = extractString(viewType);
  context.program.stateMap(StateKeys.view).set(target, {
    resource: resource.name,
    type: extractedType ?? "list",
  });
}

/**
 * @columns - Set list view columns
 */
export function $columns(
  context: DecoratorContext,
  target: Model,
  columns: unknown,
) {
  const extracted = extractStringArray(columns);
  if (extracted) {
    context.program.stateMap(StateKeys.columns).set(target, extracted);
  }
}

/**
 * @fields - Set form/show view fields
 */
export function $fields(
  context: DecoratorContext,
  target: Model,
  fields: unknown,
) {
  const extracted = extractStringArray(fields);
  if (extracted) {
    context.program.stateMap(StateKeys.fields).set(target, extracted);
  }
}

/**
 * @searchable - Set searchable fields
 */
export function $searchable(
  context: DecoratorContext,
  target: Model,
  fields: unknown,
) {
  const extracted = extractStringArray(fields);
  if (extracted) {
    context.program.stateMap(StateKeys.searchable).set(target, extracted);
  }
}

/**
 * @sortable - Set sortable fields
 */
export function $sortable(
  context: DecoratorContext,
  target: Model,
  fields: unknown,
) {
  const extracted = extractStringArray(fields);
  if (extracted) {
    context.program.stateMap(StateKeys.sortable).set(target, extracted);
  }
}

/**
 * @defaultSort - Set default sort
 */
export function $defaultSort(
  context: DecoratorContext,
  target: Model,
  field: unknown,
  order: unknown,
) {
  const extractedField = extractString(field);
  const extractedOrder = extractString(order);
  if (extractedField && extractedOrder) {
    context.program
      .stateMap(StateKeys.defaultSort)
      .set(target, { field: extractedField, order: extractedOrder });
  }
}

/**
 * @clickAction - Set row click action
 */
export function $clickAction(
  context: DecoratorContext,
  target: Model,
  action: unknown,
) {
  const extracted = extractString(action);
  if (extracted) {
    context.program.stateMap(StateKeys.clickAction).set(target, extracted);
  }
}

/**
 * @selection - Set selection mode
 */
export function $selection(
  context: DecoratorContext,
  target: Model,
  mode: unknown,
) {
  const extracted = extractString(mode);
  if (extracted) {
    context.program.stateMap(StateKeys.selection).set(target, extracted);
  }
}

/**
 * @namedFilters - Set named filters
 */
export function $namedFilters(
  context: DecoratorContext,
  target: Model,
  filters: unknown,
) {
  const extracted = extractValue(filters);
  if (Array.isArray(extracted)) {
    const cleanFilters = extracted.map((f) => ({
      id: String((f as Record<string, unknown>).id ?? ""),
      label: String((f as Record<string, unknown>).label ?? ""),
      filter: (f as Record<string, unknown>).filter,
    }));
    context.program.stateMap(StateKeys.namedFilters).set(target, cleanFilters);
  }
}

/**
 * @namedFilter - Add a named filter (singular form, accumulates)
 */
export function $namedFilter(
  context: DecoratorContext,
  target: Model,
  id: unknown,
  label: unknown,
  filter: unknown,
) {
  const extractedId = extractString(id);
  const extractedLabel = extractString(label);
  const extractedFilter = extractValue(filter);

  if (extractedId && extractedLabel) {
    const existing: { id: string; label: string; filter: unknown }[] =
      context.program.stateMap(StateKeys.namedFilters).get(target) ?? [];
    const newFilter = {
      id: extractedId,
      label: extractedLabel,
      filter: extractedFilter,
    };
    context.program
      .stateMap(StateKeys.namedFilters)
      .set(target, [...existing, newFilter]);
  }
}

// ============================================================
// Action Decorators
// ============================================================

/**
 * @action - Define an action (page-level)
 */
export function $action(
  context: DecoratorContext,
  target: ModelProperty,
  id: unknown,
) {
  const extracted = extractString(id);
  if (extracted) {
    context.program.stateMap(StateKeys.action).set(target, extracted);
  }
}

/**
 * @rowAction - Define a row action (list view)
 */
export function $rowAction(
  context: DecoratorContext,
  target: ModelProperty,
  id: unknown,
) {
  const extracted = extractString(id);
  if (extracted) {
    context.program.stateMap(StateKeys.rowAction).set(target, extracted);
  }
}

/**
 * @requiresSelection - Set selection requirement for bulk actions
 */
export function $requiresSelection(
  context: DecoratorContext,
  target: ModelProperty,
  selection: unknown,
) {
  const extracted = extractString(selection);
  if (extracted !== undefined) {
    context.program
      .stateMap(StateKeys.requiresSelection)
      .set(target, extracted);
  }
}

/**
 * @allowedWhen - Set permission expression
 */
export function $allowedWhen(
  context: DecoratorContext,
  target: ModelProperty,
  expression: unknown,
) {
  const extracted = extractString(expression);
  if (extracted) {
    context.program.stateMap(StateKeys.allowedWhen).set(target, extracted);
  }
}

/**
 * @confirm - Set confirmation message
 */
export function $confirm(
  context: DecoratorContext,
  target: ModelProperty,
  message: unknown,
) {
  const extracted = extractString(message);
  if (extracted) {
    context.program.stateMap(StateKeys.confirm).set(target, extracted);
  }
}

// ============================================================
// Validation Decorators
// ============================================================

/**
 * @required - Mark field as required
 */
export function $required(context: DecoratorContext, target: ModelProperty) {
  context.program.stateSet(StateKeys.required).add(target);
}

/**
 * @minLength - Set minimum length
 */
export function $minLength(
  context: DecoratorContext,
  target: ModelProperty,
  value: unknown,
) {
  const extracted = extractNumber(value);
  if (extracted !== undefined) {
    context.program.stateMap(StateKeys.minLength).set(target, extracted);
  }
}

/**
 * @maxLength - Set maximum length
 */
export function $maxLength(
  context: DecoratorContext,
  target: ModelProperty,
  value: unknown,
) {
  const extracted = extractNumber(value);
  if (extracted !== undefined) {
    context.program.stateMap(StateKeys.maxLength).set(target, extracted);
  }
}

/**
 * @min - Set minimum value
 */
export function $min(
  context: DecoratorContext,
  target: ModelProperty,
  value: unknown,
) {
  const extracted = extractNumber(value);
  if (extracted !== undefined) {
    context.program.stateMap(StateKeys.min).set(target, extracted);
  }
}

/**
 * @max - Set maximum value
 */
export function $max(
  context: DecoratorContext,
  target: ModelProperty,
  value: unknown,
) {
  const extracted = extractNumber(value);
  if (extracted !== undefined) {
    context.program.stateMap(StateKeys.max).set(target, extracted);
  }
}

/**
 * @pattern - Set regex pattern
 */
export function $pattern(
  context: DecoratorContext,
  target: ModelProperty,
  pattern: unknown,
) {
  const extracted = extractString(pattern);
  if (extracted) {
    context.program.stateMap(StateKeys.pattern).set(target, extracted);
  }
}

/**
 * @minItems - Set minimum items
 */
export function $minItems(
  context: DecoratorContext,
  target: ModelProperty,
  value: unknown,
) {
  const extracted = extractNumber(value);
  if (extracted !== undefined) {
    context.program.stateMap(StateKeys.minItems).set(target, extracted);
  }
}

/**
 * @maxItems - Set maximum items
 */
export function $maxItems(
  context: DecoratorContext,
  target: ModelProperty,
  value: unknown,
) {
  const extracted = extractNumber(value);
  if (extracted !== undefined) {
    context.program.stateMap(StateKeys.maxItems).set(target, extracted);
  }
}

// ============================================================
// Helper functions to get decorator data
// ============================================================

export function getResourceName(
  program: DecoratorContext["program"],
  target: Model,
): string | undefined {
  return program.stateMap(StateKeys.resource).get(target);
}

export function getLabel(
  program: DecoratorContext["program"],
  target: Type,
): string | undefined {
  return program.stateMap(StateKeys.label).get(target);
}

export function getKind(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.kind).get(target);
}

export function getOptions(
  program: DecoratorContext["program"],
  target: ModelProperty,
): { value: string; label: string }[] | undefined {
  return program.stateMap(StateKeys.options).get(target);
}

export function getRelation(
  program: DecoratorContext["program"],
  target: ModelProperty,
): { resource: string; labelField?: string } | undefined {
  return program.stateMap(StateKeys.relation).get(target);
}

export function getUI(
  program: DecoratorContext["program"],
  target: Type,
): Record<string, unknown> | undefined {
  return program.stateMap(StateKeys.ui).get(target);
}

export function isReadonly(
  program: DecoratorContext["program"],
  target: ModelProperty,
): boolean {
  return program.stateSet(StateKeys.readonly).has(target);
}

export function isComputed(
  program: DecoratorContext["program"],
  target: ModelProperty,
): boolean {
  return program.stateSet(StateKeys.computed).has(target);
}

export function isRequired(
  program: DecoratorContext["program"],
  target: ModelProperty,
): boolean {
  return program.stateSet(StateKeys.required).has(target);
}

export function getFilter(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string[] | true | undefined {
  return program.stateMap(StateKeys.filter).get(target);
}

export function getView(
  program: DecoratorContext["program"],
  target: Model,
): { resource: string; type: string } | undefined {
  return program.stateMap(StateKeys.view).get(target);
}

export function getColumns(
  program: DecoratorContext["program"],
  target: Model,
): string[] | undefined {
  return program.stateMap(StateKeys.columns).get(target);
}

export function getFields(
  program: DecoratorContext["program"],
  target: Model,
): string[] | undefined {
  return program.stateMap(StateKeys.fields).get(target);
}

export function getSearchable(
  program: DecoratorContext["program"],
  target: Model,
): string[] | undefined {
  return program.stateMap(StateKeys.searchable).get(target);
}

export function getSortable(
  program: DecoratorContext["program"],
  target: Model,
): string[] | undefined {
  return program.stateMap(StateKeys.sortable).get(target);
}

export function getDefaultSort(
  program: DecoratorContext["program"],
  target: Model,
): { field: string; order: string } | undefined {
  return program.stateMap(StateKeys.defaultSort).get(target);
}

export function getClickAction(
  program: DecoratorContext["program"],
  target: Model,
): string | undefined {
  return program.stateMap(StateKeys.clickAction).get(target);
}

export function getSelection(
  program: DecoratorContext["program"],
  target: Model,
): string | undefined {
  return program.stateMap(StateKeys.selection).get(target);
}

export function getNamedFilters(
  program: DecoratorContext["program"],
  target: Model,
): { id: string; label: string; filter: unknown }[] | undefined {
  return program.stateMap(StateKeys.namedFilters).get(target);
}

export function getAction(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.action).get(target);
}

export function getRowAction(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.rowAction).get(target);
}

export function getRequiresSelection(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.requiresSelection).get(target);
}

export function getAllowedWhen(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.allowedWhen).get(target);
}

export function getConfirm(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.confirm).get(target);
}

export function getMinLength(
  program: DecoratorContext["program"],
  target: ModelProperty,
): number | undefined {
  return program.stateMap(StateKeys.minLength).get(target);
}

export function getMaxLength(
  program: DecoratorContext["program"],
  target: ModelProperty,
): number | undefined {
  return program.stateMap(StateKeys.maxLength).get(target);
}

export function getMin(
  program: DecoratorContext["program"],
  target: ModelProperty,
): number | undefined {
  return program.stateMap(StateKeys.min).get(target);
}

export function getMax(
  program: DecoratorContext["program"],
  target: ModelProperty,
): number | undefined {
  return program.stateMap(StateKeys.max).get(target);
}

export function getPattern(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.pattern).get(target);
}

export function getMinItems(
  program: DecoratorContext["program"],
  target: ModelProperty,
): number | undefined {
  return program.stateMap(StateKeys.minItems).get(target);
}

export function getMaxItems(
  program: DecoratorContext["program"],
  target: ModelProperty,
): number | undefined {
  return program.stateMap(StateKeys.maxItems).get(target);
}
