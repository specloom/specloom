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

/**
 * Merge partial UI options into existing UI state
 */
function mergeUI(
  context: DecoratorContext,
  target: Model | ModelProperty,
  patch: Record<string, unknown>,
) {
  const current =
    (context.program.stateMap(StateKeys.ui).get(target) as
      | Record<string, unknown>
      | undefined) ?? {};
  context.program.stateMap(StateKeys.ui).set(target, { ...current, ...patch });
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
 * @requiredOneOf - Require at least one field in the group
 */
export function $requiredOneOf(
  context: DecoratorContext,
  target: Model,
  fields: unknown,
) {
  const extracted = extractStringArray(fields);
  if (extracted && extracted.length > 0) {
    const existing: string[][] =
      context.program.stateMap(StateKeys.requiredOneOf).get(target) ?? [];
    // TypeSpec processes decorators bottom-to-top, so prepend to keep source order.
    context.program
      .stateMap(StateKeys.requiredOneOf)
      .set(target, [extracted, ...existing]);
  }
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
    | { labelField?: string; valueField?: string; searchable?: boolean }
    | undefined;
  const cardinality = extractString(
    context.program.stateMap(StateKeys.cardinality).get(target),
  );
  context.program.stateMap(StateKeys.relation).set(target, {
    resource: resource.name,
    labelField: extracted?.labelField,
    valueField: extracted?.valueField,
    searchable: extracted?.searchable,
    cardinality,
  });
}

/**
 * @cardinality - Legacy alias of @relation(..., #{ cardinality: ... }) intent
 */
export function $cardinality(
  context: DecoratorContext,
  target: ModelProperty,
  cardinality: unknown,
) {
  const extracted = extractString(cardinality);
  if (extracted) {
    context.program.stateMap(StateKeys.cardinality).set(target, extracted);
    const relation = context.program
      .stateMap(StateKeys.relation)
      .get(target) as Record<string, unknown> | undefined;
    if (relation) {
      context.program
        .stateMap(StateKeys.relation)
        .set(target, { ...relation, cardinality: extracted });
    }
  }
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
    mergeUI(context, target, extracted);
  }
}

/**
 * @hint - Legacy alias for @ui(#{ hint: ... })
 */
export function $hint(
  context: DecoratorContext,
  target: ModelProperty,
  hint: unknown,
) {
  const extracted = extractString(hint);
  if (extracted) {
    mergeUI(context, target, { hint: extracted });
  }
}

/**
 * @inputHint - Legacy alias for @ui(#{ inputHint: ... })
 */
export function $inputHint(
  context: DecoratorContext,
  target: ModelProperty,
  inputHint: unknown,
) {
  const extracted = extractString(inputHint);
  if (extracted) {
    mergeUI(context, target, { inputHint: extracted });
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
 * @createOnly - Mark field as create-only (only shown on create form)
 */
export function $createOnly(context: DecoratorContext, target: ModelProperty) {
  context.program.stateSet(StateKeys.createOnly).add(target);
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
  const normalized = extracted?.map((op) => {
    switch (op) {
      case "startsWith":
        return "starts_with";
      case "endsWith":
        return "ends_with";
      case "notIn":
        return "not_in";
      case "isNull":
        return "is_null";
      case "isEmpty":
        return "is_empty";
      case "hasAny":
        return "has_any";
      case "hasAll":
        return "has_all";
      case "hasNone":
        return "has_none";
      default:
        return op;
    }
  });
  context.program.stateMap(StateKeys.filter).set(target, normalized ?? true);
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
    // TypeSpec processes decorators bottom-to-top, so prepend to maintain source order
    context.program
      .stateMap(StateKeys.namedFilters)
      .set(target, [newFilter, ...existing]);
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
 * @placement - Legacy action placement alias
 * Prefer @rowAction for row actions and @requiresSelection for bulk actions.
 */
export function $placement(
  context: DecoratorContext,
  target: ModelProperty,
  placement: unknown,
) {
  const extracted = extractString(placement);
  if (extracted) {
    context.program.stateMap(StateKeys.placement).set(target, extracted);
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
  const raw = extractValue(selection);
  const extracted =
    typeof raw === "string"
      ? raw
      : typeof raw === "boolean"
        ? "selected"
        : undefined;
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
 * @visibleWhen - Set conditional visibility expression
 */
export function $visibleWhen(
  context: DecoratorContext,
  target: ModelProperty,
  expression: unknown,
) {
  const extracted = extractString(expression);
  if (extracted) {
    context.program.stateMap(StateKeys.visibleWhen).set(target, extracted);
  }
}

/**
 * @requiredWhen - Set conditional required expression
 */
export function $requiredWhen(
  context: DecoratorContext,
  target: ModelProperty,
  expression: unknown,
) {
  const extracted = extractString(expression);
  if (extracted) {
    context.program.stateMap(StateKeys.requiredWhen).set(target, extracted);
  }
}

/**
 * @confirm - Set confirmation message
 */
export function $confirm(
  context: DecoratorContext,
  target: ModelProperty,
  message?: unknown,
) {
  const extracted = extractString(message);
  context.program.stateMap(StateKeys.confirm).set(target, extracted ?? true);
}

/**
 * @dialog - Define a dialog for an action
 */
export function $dialog(
  context: DecoratorContext,
  target: ModelProperty,
  model: Model,
  options?: unknown,
) {
  const extractedOptions = extractValue(options) as
    | { title?: string; description?: string }
    | undefined;
  context.program.stateMap(StateKeys.dialog).set(target, {
    model: model,
    title: extractedOptions?.title,
    description: extractedOptions?.description,
  });
}

/**
 * @api - Define API endpoint for an action
 */
export function $api(
  context: DecoratorContext,
  target: ModelProperty,
  options: unknown,
) {
  const extracted = extractValue(options) as {
    path: string;
    method?: string;
    params?: unknown;
    body?: string[];
    query?: unknown;
  } | null;
  if (extracted && extracted.path) {
    context.program.stateMap(StateKeys.api).set(target, {
      path: extracted.path,
      method: extracted.method ?? "POST",
      params: extracted.params,
      body: extracted.body,
      query: extracted.query,
    });
  }
}

/**
 * @match - Set field match validation
 */
export function $match(
  context: DecoratorContext,
  target: ModelProperty,
  field: unknown,
) {
  const extracted = extractString(field);
  if (extracted) {
    context.program.stateMap(StateKeys.match).set(target, extracted);
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

// @minLength, @maxLength, @pattern, @minItems, @maxItems は TypeSpec 標準を使用

// ============================================================
// Helper functions to get decorator data
// ============================================================

export function getResourceName(
  program: DecoratorContext["program"],
  target: Model,
): string | undefined {
  return program.stateMap(StateKeys.resource).get(target);
}

export function getRequiredOneOf(
  program: DecoratorContext["program"],
  target: Model,
): string[][] | undefined {
  return program.stateMap(StateKeys.requiredOneOf).get(target);
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
):
  | {
      resource: string;
      labelField?: string;
      valueField?: string;
      searchable?: boolean;
      cardinality?: string;
    }
  | undefined {
  return program.stateMap(StateKeys.relation).get(target);
}

export function getCardinality(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.cardinality).get(target);
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

export function isCreateOnly(
  program: DecoratorContext["program"],
  target: ModelProperty,
): boolean {
  return program.stateSet(StateKeys.createOnly).has(target);
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

export function getPlacement(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.placement).get(target);
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

export function getVisibleWhen(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.visibleWhen).get(target);
}

export function getRequiredWhen(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.requiredWhen).get(target);
}

export function getConfirm(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | true | undefined {
  return program.stateMap(StateKeys.confirm).get(target);
}

// getMinLength, getMaxLength は @typespec/compiler から使用

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

// getPattern, getMinItems, getMaxItems は @typespec/compiler から使用

export function getDialog(
  program: DecoratorContext["program"],
  target: ModelProperty,
): { model: Model; title?: string; description?: string } | undefined {
  return program.stateMap(StateKeys.dialog).get(target);
}

export function getApi(
  program: DecoratorContext["program"],
  target: ModelProperty,
):
  | {
      path: string;
      method: string;
      params?: unknown;
      body?: string[];
      query?: unknown;
    }
  | undefined {
  return program.stateMap(StateKeys.api).get(target);
}

export function getMatch(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.match).get(target);
}
