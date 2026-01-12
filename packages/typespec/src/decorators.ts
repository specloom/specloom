import type {
  DecoratorContext,
  Model,
  ModelProperty,
  Type,
} from "@typespec/compiler";
import { StateKeys } from "./lib.js";

// ============================================================
// Resource Decorators
// ============================================================

/**
 * @resource - Mark a model as a resource
 */
export function $resource(
  context: DecoratorContext,
  target: Model,
  name?: string
) {
  context.program.stateMap(StateKeys.resource).set(target, name ?? target.name);
}

/**
 * @label - Set display label
 */
export function $label(
  context: DecoratorContext,
  target: Model | ModelProperty,
  label: string
) {
  context.program.stateMap(StateKeys.label).set(target, label);
}

/**
 * @kind - Set field kind (text, longText, enum, relation, etc.)
 */
export function $kind(
  context: DecoratorContext,
  target: ModelProperty,
  kind: string
) {
  context.program.stateMap(StateKeys.kind).set(target, kind);
}

/**
 * @options - Set enum options
 */
export function $options(
  context: DecoratorContext,
  target: ModelProperty,
  options: { value: string; label: string }[]
) {
  context.program.stateMap(StateKeys.options).set(target, options);
}

/**
 * @relation - Define relation to another resource
 */
export function $relation(
  context: DecoratorContext,
  target: ModelProperty,
  resource: Model,
  options?: { labelField?: string }
) {
  context.program.stateMap(StateKeys.relation).set(target, {
    resource: resource.name,
    labelField: options?.labelField,
  });
}

/**
 * @ui - Set UI hints
 */
export function $ui(
  context: DecoratorContext,
  target: ModelProperty | Model,
  options: {
    hint?: string;
    inputHint?: string;
    format?: string;
    link?: boolean;
    icon?: string;
    variant?: string;
    searchable?: boolean;
  }
) {
  context.program.stateMap(StateKeys.ui).set(target, options);
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
  operators?: string[]
) {
  context.program.stateMap(StateKeys.filter).set(target, operators ?? true);
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
  viewType: "list" | "form" | "show"
) {
  context.program.stateMap(StateKeys.view).set(target, {
    resource: resource.name,
    type: viewType,
  });
}

/**
 * @columns - Set list view columns
 */
export function $columns(
  context: DecoratorContext,
  target: Model,
  columns: string[]
) {
  context.program.stateMap(StateKeys.columns).set(target, columns);
}

/**
 * @fields - Set form/show view fields
 */
export function $fields(
  context: DecoratorContext,
  target: Model,
  fields: string[]
) {
  context.program.stateMap(StateKeys.fields).set(target, fields);
}

/**
 * @searchable - Set searchable fields
 */
export function $searchable(
  context: DecoratorContext,
  target: Model,
  fields: string[]
) {
  context.program.stateMap(StateKeys.searchable).set(target, fields);
}

/**
 * @sortable - Set sortable fields
 */
export function $sortable(
  context: DecoratorContext,
  target: Model,
  fields: string[]
) {
  context.program.stateMap(StateKeys.sortable).set(target, fields);
}

/**
 * @defaultSort - Set default sort
 */
export function $defaultSort(
  context: DecoratorContext,
  target: Model,
  field: string,
  order: "asc" | "desc"
) {
  context.program.stateMap(StateKeys.defaultSort).set(target, { field, order });
}

/**
 * @clickAction - Set row click action
 */
export function $clickAction(
  context: DecoratorContext,
  target: Model,
  action: string
) {
  context.program.stateMap(StateKeys.clickAction).set(target, action);
}

/**
 * @selection - Set selection mode
 */
export function $selection(
  context: DecoratorContext,
  target: Model,
  mode: "none" | "single" | "multi"
) {
  context.program.stateMap(StateKeys.selection).set(target, mode);
}

/**
 * @namedFilters - Set named filters
 */
export function $namedFilters(
  context: DecoratorContext,
  target: Model,
  filters: { id: string; label: string; filter: unknown }[]
) {
  context.program.stateMap(StateKeys.namedFilters).set(target, filters);
}

// ============================================================
// Action Decorators
// ============================================================

/**
 * @action - Define an action
 */
export function $action(
  context: DecoratorContext,
  target: ModelProperty,
  id: string
) {
  context.program.stateMap(StateKeys.action).set(target, id);
}

/**
 * @placement - Set action placement
 */
export function $placement(
  context: DecoratorContext,
  target: ModelProperty,
  placement: "header" | "row" | "bulk"
) {
  context.program.stateMap(StateKeys.placement).set(target, placement);
}

/**
 * @allowedWhen - Set permission expression
 */
export function $allowedWhen(
  context: DecoratorContext,
  target: ModelProperty,
  expression: string
) {
  context.program.stateMap(StateKeys.allowedWhen).set(target, expression);
}

/**
 * @confirm - Set confirmation message
 */
export function $confirm(
  context: DecoratorContext,
  target: ModelProperty,
  message: string
) {
  context.program.stateMap(StateKeys.confirm).set(target, message);
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
  value: number
) {
  context.program.stateMap(StateKeys.minLength).set(target, value);
}

/**
 * @maxLength - Set maximum length
 */
export function $maxLength(
  context: DecoratorContext,
  target: ModelProperty,
  value: number
) {
  context.program.stateMap(StateKeys.maxLength).set(target, value);
}

/**
 * @min - Set minimum value
 */
export function $min(
  context: DecoratorContext,
  target: ModelProperty,
  value: number
) {
  context.program.stateMap(StateKeys.min).set(target, value);
}

/**
 * @max - Set maximum value
 */
export function $max(
  context: DecoratorContext,
  target: ModelProperty,
  value: number
) {
  context.program.stateMap(StateKeys.max).set(target, value);
}

/**
 * @pattern - Set regex pattern
 */
export function $pattern(
  context: DecoratorContext,
  target: ModelProperty,
  pattern: string
) {
  context.program.stateMap(StateKeys.pattern).set(target, pattern);
}

/**
 * @minItems - Set minimum items
 */
export function $minItems(
  context: DecoratorContext,
  target: ModelProperty,
  value: number
) {
  context.program.stateMap(StateKeys.minItems).set(target, value);
}

/**
 * @maxItems - Set maximum items
 */
export function $maxItems(
  context: DecoratorContext,
  target: ModelProperty,
  value: number
) {
  context.program.stateMap(StateKeys.maxItems).set(target, value);
}

// ============================================================
// Helper functions to get decorator data
// ============================================================

export function getResourceName(
  program: DecoratorContext["program"],
  target: Model
): string | undefined {
  return program.stateMap(StateKeys.resource).get(target);
}

export function getLabel(
  program: DecoratorContext["program"],
  target: Type
): string | undefined {
  return program.stateMap(StateKeys.label).get(target);
}

export function getKind(
  program: DecoratorContext["program"],
  target: ModelProperty
): string | undefined {
  return program.stateMap(StateKeys.kind).get(target);
}

export function getOptions(
  program: DecoratorContext["program"],
  target: ModelProperty
): { value: string; label: string }[] | undefined {
  return program.stateMap(StateKeys.options).get(target);
}

export function getRelation(
  program: DecoratorContext["program"],
  target: ModelProperty
): { resource: string; labelField?: string } | undefined {
  return program.stateMap(StateKeys.relation).get(target);
}

export function getUI(
  program: DecoratorContext["program"],
  target: Type
): Record<string, unknown> | undefined {
  return program.stateMap(StateKeys.ui).get(target);
}

export function isReadonly(
  program: DecoratorContext["program"],
  target: ModelProperty
): boolean {
  return program.stateSet(StateKeys.readonly).has(target);
}

export function isComputed(
  program: DecoratorContext["program"],
  target: ModelProperty
): boolean {
  return program.stateSet(StateKeys.computed).has(target);
}

export function isRequired(
  program: DecoratorContext["program"],
  target: ModelProperty
): boolean {
  return program.stateSet(StateKeys.required).has(target);
}

export function getFilter(
  program: DecoratorContext["program"],
  target: ModelProperty
): string[] | true | undefined {
  return program.stateMap(StateKeys.filter).get(target);
}

export function getView(
  program: DecoratorContext["program"],
  target: Model
): { resource: string; type: string } | undefined {
  return program.stateMap(StateKeys.view).get(target);
}

export function getColumns(
  program: DecoratorContext["program"],
  target: Model
): string[] | undefined {
  return program.stateMap(StateKeys.columns).get(target);
}

export function getFields(
  program: DecoratorContext["program"],
  target: Model
): string[] | undefined {
  return program.stateMap(StateKeys.fields).get(target);
}

export function getSearchable(
  program: DecoratorContext["program"],
  target: Model
): string[] | undefined {
  return program.stateMap(StateKeys.searchable).get(target);
}

export function getSortable(
  program: DecoratorContext["program"],
  target: Model
): string[] | undefined {
  return program.stateMap(StateKeys.sortable).get(target);
}

export function getDefaultSort(
  program: DecoratorContext["program"],
  target: Model
): { field: string; order: string } | undefined {
  return program.stateMap(StateKeys.defaultSort).get(target);
}

export function getClickAction(
  program: DecoratorContext["program"],
  target: Model
): string | undefined {
  return program.stateMap(StateKeys.clickAction).get(target);
}

export function getSelection(
  program: DecoratorContext["program"],
  target: Model
): string | undefined {
  return program.stateMap(StateKeys.selection).get(target);
}

export function getNamedFilters(
  program: DecoratorContext["program"],
  target: Model
): { id: string; label: string; filter: unknown }[] | undefined {
  return program.stateMap(StateKeys.namedFilters).get(target);
}

export function getAction(
  program: DecoratorContext["program"],
  target: ModelProperty
): string | undefined {
  return program.stateMap(StateKeys.action).get(target);
}

export function getPlacement(
  program: DecoratorContext["program"],
  target: ModelProperty
): string | undefined {
  return program.stateMap(StateKeys.placement).get(target);
}

export function getAllowedWhen(
  program: DecoratorContext["program"],
  target: ModelProperty
): string | undefined {
  return program.stateMap(StateKeys.allowedWhen).get(target);
}

export function getConfirm(
  program: DecoratorContext["program"],
  target: ModelProperty
): string | undefined {
  return program.stateMap(StateKeys.confirm).get(target);
}

export function getMinLength(
  program: DecoratorContext["program"],
  target: ModelProperty
): number | undefined {
  return program.stateMap(StateKeys.minLength).get(target);
}

export function getMaxLength(
  program: DecoratorContext["program"],
  target: ModelProperty
): number | undefined {
  return program.stateMap(StateKeys.maxLength).get(target);
}

export function getMin(
  program: DecoratorContext["program"],
  target: ModelProperty
): number | undefined {
  return program.stateMap(StateKeys.min).get(target);
}

export function getMax(
  program: DecoratorContext["program"],
  target: ModelProperty
): number | undefined {
  return program.stateMap(StateKeys.max).get(target);
}

export function getPattern(
  program: DecoratorContext["program"],
  target: ModelProperty
): string | undefined {
  return program.stateMap(StateKeys.pattern).get(target);
}

export function getMinItems(
  program: DecoratorContext["program"],
  target: ModelProperty
): number | undefined {
  return program.stateMap(StateKeys.minItems).get(target);
}

export function getMaxItems(
  program: DecoratorContext["program"],
  target: ModelProperty
): number | undefined {
  return program.stateMap(StateKeys.maxItems).get(target);
}
