import type {
  DecoratorContext,
  Model,
  ModelProperty,
  Operation,
  Type,
  Value,
} from "@typespec/compiler";
import { StateKeys } from "./lib.js";

export interface EntityDef {
  label?: string;
  pluralLabel?: string;
  titleField?: string;
  pageSize?: number;
  defaultSort?: { field: string; direction: "asc" | "desc" };
  operations?: {
    list?: boolean;
    show?: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
  client?: Record<string, unknown>;
}

export interface FieldDef {
  label?: string;
  widget?: string;
  appearance?: string;
  section?: string;
  order?: number;
  list?: boolean;
  show?: boolean;
  form?: boolean;
  readonly?: boolean;
  placeholder?: string;
  help?: string;
  defaultValue?: unknown;
  format?: string;
  emptyText?: string;
  display?: {
    list?: { field?: string; template?: string };
    show?: { field?: string; template?: string };
  };
  placement?: {
    list?: string;
    show?: string;
    form?: string;
  };
  client?: Record<string, unknown>;
}

export interface ActionRefDef {
  ref: string;
  label?: string;
  placement?: string;
  order?: number;
  icon?: string;
  prominence?: "primary" | "secondary" | "subtle" | "danger";
  confirm?: ActionConfirmDef;
  selection?: "none" | "selected" | "query";
  args?: Record<string, unknown>;
  when?: string;
  disabledWhen?: string;
  client?: Record<string, unknown>;
}

export interface ListViewDef {
  columns?: unknown[];
  search?: {
    fields: string[];
  };
  filters?: ListFilterDef[];
  sortable?: string[];
  pageSizeOptions?: number[];
  defaultSort?: { field: string; direction: "asc" | "desc" };
  selection?: "none" | "single" | "multi";
  clickAction?: "none" | "show" | "edit";
  namedFilters?: NamedFilterDef[];
  pageActions?: ActionRefDef[];
  rowActions?: ActionRefDef[];
}

export interface RecordViewDef {
  pageActions?: ActionRefDef[];
}

export interface ListFilterDef {
  field: string;
  operators?: string[];
  widget?: string;
  order?: number;
  placement?: "toolbar" | "advanced";
  defaultValue?: unknown;
}

export interface NamedFilterDef {
  id: string;
  label: string;
  order?: number;
  conditions: unknown;
}

export interface RelationDef {
  resource: string;
  kind?: "belongsTo" | "hasOne" | "hasMany" | "manyToMany";
  cardinality?: "one" | "many";
  labelField?: string;
  valueField?: string;
  submitField?: string;
  searchFields?: string[];
  lookupResource?: string;
  lookupOp?: string;
  linkTo?: "show" | "edit" | "none";
  creatable?: boolean;
  client?: Record<string, unknown>;
}

export interface NestedDef {
  resource: string;
  cardinality?: "one" | "many";
  minItems?: number;
  maxItems?: number;
  widget?: "inline-form" | "table" | "cards";
}

export interface SectionDef {
  id: string;
  label: string;
  order?: number;
  view?: "form" | "show";
  placement?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface OptionDef {
  value: string | number | boolean;
  label: string;
}

export interface OptionSourceDef {
  resource?: string;
  op?: string;
  labelField: string;
  valueField: string;
  searchFields?: string[];
}

export interface ActionDef {
  resource: string;
  id: string;
  label?: string;
  placement?: string;
  order?: number;
  icon?: string;
  prominence?: "primary" | "secondary" | "subtle" | "danger";
  confirm?: ActionConfirmDef;
  args?: Record<string, unknown>;
  when?: string;
  disabledWhen?: string;
  client?: Record<string, unknown>;
  inputModel?: Model;
}

export interface ActionConfirmDef {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface RuleDef {
  kind: string;
  fields?: string[];
  field?: string;
  left?: string;
  right?: string;
  operator?: string;
  when?: string;
  message?: string;
}

function extractValue(val: Value | unknown): unknown {
  if (val === null || val === undefined) {
    return val;
  }

  if (typeof val === "object" && val !== null && "valueKind" in val) {
    const v = val as { valueKind: string; value?: unknown; values?: unknown[] };
    switch (v.valueKind) {
      case "StringValue":
      case "BooleanValue":
        return v.value;
      case "NumericValue":
        return extractNumericValue(v.value);
      case "ArrayValue":
        return (v.values ?? []).map(extractValue);
      case "ObjectValue":
        return extractObjectValue(v);
      default:
        return v.value;
    }
  }

  return val;
}

function extractNumericValue(value: unknown): unknown {
  if (typeof value === "number") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "asNumber" in value &&
    typeof (value as { asNumber?: unknown }).asNumber === "function"
  ) {
    return (value as { asNumber(): number }).asNumber();
  }

  return value;
}

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

function extractString(val: unknown): string | undefined {
  const extracted = extractValue(val);
  return typeof extracted === "string" ? extracted : undefined;
}

function extractStringArray(val: unknown): string[] | undefined {
  const extracted = extractValue(val);
  if (!Array.isArray(extracted)) {
    return undefined;
  }
  return extracted.filter((item): item is string => typeof item === "string");
}

function extractNumber(val: unknown): number | undefined {
  const extracted = extractValue(val);
  return typeof extracted === "number" ? extracted : undefined;
}

function extractNumberArray(val: unknown): number[] | undefined {
  const extracted = extractValue(val);
  if (!Array.isArray(extracted)) {
    return undefined;
  }
  return extracted.filter((item): item is number => typeof item === "number");
}

function extractRecord(val: unknown): Record<string, unknown> | undefined {
  const extracted = extractValue(val);
  return extracted && typeof extracted === "object" && !Array.isArray(extracted)
    ? (extracted as Record<string, unknown>)
    : undefined;
}

function normalizeActionRefs(value: unknown): ActionRefDef[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const refs: ActionRefDef[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      refs.push({ ref: item });
      continue;
    }

    if (!item || typeof item !== "object") {
      continue;
    }

    const rec = item as Record<string, unknown>;
    const ref = extractString(rec.ref) ?? extractString(rec.id);
    if (!ref) {
      continue;
    }

    refs.push({
      ref,
      label: extractString(rec.label),
      placement: extractString(rec.placement),
      order: extractNumber(rec.order),
      icon: extractString(rec.icon),
      prominence: extractString(rec.prominence) as
        | ActionRefDef["prominence"]
        | undefined,
      confirm: normalizeActionConfirm(rec.confirm),
      selection: extractString(rec.selection) as
        | ActionRefDef["selection"]
        | undefined,
      args: extractRecord(rec.args),
      when: extractString(rec.when),
      disabledWhen: extractString(rec.disabledWhen),
      client: extractRecord(rec.client),
    });
  }

  return refs;
}

function normalizeActionConfirm(value: unknown): ActionConfirmDef | undefined {
  const record = extractRecord(value);
  const message = extractString(record?.message);
  if (!message) {
    return undefined;
  }

  return {
    message,
    title: extractString(record?.title),
    confirmLabel: extractString(record?.confirmLabel),
    cancelLabel: extractString(record?.cancelLabel),
  };
}

function normalizeSearch(value: unknown): ListViewDef["search"] | undefined {
  const record = extractRecord(value);
  const fields = extractStringArray(record?.fields);
  return fields && fields.length > 0 ? { fields } : undefined;
}

function normalizeListFilters(value: unknown): ListFilterDef[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const filters: ListFilterDef[] = [];
  for (const item of value) {
    const rec = extractRecord(item);
    const field = extractString(rec?.field);
    if (!field) {
      continue;
    }

    filters.push({
      field,
      operators: extractStringArray(rec?.operators),
      widget: extractString(rec?.widget),
      order: extractNumber(rec?.order),
      placement: extractString(rec?.placement) as
        | ListFilterDef["placement"]
        | undefined,
      defaultValue: rec?.defaultValue,
    });
  }

  return filters;
}

function mergeState<T extends Model | ModelProperty | Operation>(
  context: DecoratorContext,
  key: symbol,
  target: T,
  patch: Record<string, unknown>,
) {
  const current =
    (context.program.stateMap(key).get(target) as
      | Record<string, unknown>
      | undefined) ?? {};
  context.program.stateMap(key).set(target, { ...current, ...patch });
}

function prependStateArray<T extends Model | Operation, TValue>(
  context: DecoratorContext,
  key: symbol,
  target: T,
  value: TValue,
) {
  const existing =
    (context.program.stateMap(key).get(target) as TValue[] | undefined) ?? [];
  context.program.stateMap(key).set(target, [value, ...existing]);
}

export function $entity(
  context: DecoratorContext,
  target: Model,
  options?: unknown,
) {
  const extracted = extractRecord(options) ?? {};
  mergeState(context, StateKeys.entity, target, extracted);
}

export function $field(
  context: DecoratorContext,
  target: ModelProperty,
  options?: unknown,
) {
  const extracted = extractRecord(options) ?? {};
  mergeState(context, StateKeys.field, target, extracted);
}

export function $listView(
  context: DecoratorContext,
  target: Model,
  options?: unknown,
) {
  const extracted = extractRecord(options) ?? {};
  extracted.search = normalizeSearch(extracted.search);
  extracted.filters = normalizeListFilters(extracted.filters);
  extracted.pageSizeOptions = extractNumberArray(extracted.pageSizeOptions);

  // Extract namedFilters from listView options
  if (Array.isArray(extracted.namedFilters)) {
    const namedFilters: NamedFilterDef[] = [];
    for (const item of extracted.namedFilters) {
      if (item && typeof item === "object") {
        const rec = item as Record<string, unknown>;
        const id = typeof rec.id === "string" ? rec.id : undefined;
        const label = typeof rec.label === "string" ? rec.label : undefined;
        if (id && label) {
          namedFilters.push({
            id,
            label,
            order: typeof rec.order === "number" ? rec.order : undefined,
            conditions: rec.conditions,
          });
        }
      }
    }
    extracted.namedFilters = namedFilters;
  }

  extracted.pageActions = normalizeActionRefs(extracted.pageActions);
  extracted.rowActions = normalizeActionRefs(extracted.rowActions);

  mergeState(context, StateKeys.listView, target, extracted);
}

export function $showView(
  context: DecoratorContext,
  target: Model,
  options?: unknown,
) {
  const extracted = extractRecord(options) ?? {};
  extracted.pageActions = normalizeActionRefs(extracted.pageActions);
  mergeState(context, StateKeys.showView, target, extracted);
}

export function $formView(
  context: DecoratorContext,
  target: Model,
  options?: unknown,
) {
  const extracted = extractRecord(options) ?? {};
  extracted.pageActions = normalizeActionRefs(extracted.pageActions);
  mergeState(context, StateKeys.formView, target, extracted);
}

export function $relation(
  context: DecoratorContext,
  target: ModelProperty,
  resource: Model,
  options?: unknown,
) {
  const extracted = extractRecord(options) ?? {};
  context.program.stateMap(StateKeys.relation).set(target, {
    ...extracted,
    resource: resource.name,
  } satisfies RelationDef);
}

export function $nested(
  context: DecoratorContext,
  target: ModelProperty,
  resource: Model,
  options?: unknown,
) {
  const extracted = extractRecord(options) ?? {};
  context.program.stateMap(StateKeys.nested).set(target, {
    ...extracted,
    resource: resource.name,
  } satisfies NestedDef);
}

export function $section(
  context: DecoratorContext,
  target: Model,
  id: unknown,
  options: unknown,
) {
  const extractedId = extractString(id);
  const extracted = extractRecord(options);
  if (!extractedId || !extracted) {
    return;
  }

  const label = extractString(extracted.label);
  if (!label) {
    return;
  }

  prependStateArray<Model, SectionDef>(context, StateKeys.section, target, {
    id: extractedId,
    label,
    order: extractNumber(extracted.order),
    view:
      extracted.view === "form" || extracted.view === "show"
        ? extracted.view
        : undefined,
    placement: extractString(extracted.placement),
    collapsible:
      typeof extracted.collapsible === "boolean"
        ? extracted.collapsible
        : undefined,
    defaultCollapsed:
      typeof extracted.defaultCollapsed === "boolean"
        ? extracted.defaultCollapsed
        : undefined,
  });
}

export function $hidden(context: DecoratorContext, target: ModelProperty) {
  context.program.stateSet(StateKeys.hidden).add(target);
}

export function $computed(context: DecoratorContext, target: ModelProperty) {
  context.program.stateSet(StateKeys.computed).add(target);
}

export function $createOnly(context: DecoratorContext, target: ModelProperty) {
  context.program.stateSet(StateKeys.createOnly).add(target);
}

export function $options(
  context: DecoratorContext,
  target: ModelProperty,
  options: unknown,
) {
  const extracted = extractValue(options);
  const clean: OptionDef[] = [];
  if (Array.isArray(extracted)) {
    for (const item of extracted) {
      if (
        item &&
        typeof item === "object" &&
        "value" in item &&
        "label" in item
      ) {
        const value = (item as Record<string, unknown>).value;
        const label = (item as Record<string, unknown>).label;
        if (
          (typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean") &&
          typeof label === "string"
        ) {
          clean.push({ value, label });
        }
      }
    }
  }
  context.program.stateMap(StateKeys.options).set(target, clean);
}

export function $optionSource(
  context: DecoratorContext,
  target: ModelProperty,
  options: unknown,
) {
  const extracted = extractRecord(options);
  if (extracted) {
    context.program.stateMap(StateKeys.optionSource).set(target, extracted);
  }
}

export function $action(
  context: DecoratorContext,
  target: Operation,
  resource: Model,
  options?: unknown,
  inputModel?: Model,
) {
  const extracted = extractRecord(options) ?? {};
  const id = extractString(extracted.id) ?? target.name;
  context.program.stateMap(StateKeys.action).set(target, {
    ...extracted,
    confirm: normalizeActionConfirm(extracted.confirm),
    resource: resource.name,
    id,
    inputModel,
  } satisfies ActionDef);
}

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

export function $readonlyWhen(
  context: DecoratorContext,
  target: ModelProperty,
  expression: unknown,
) {
  const extracted = extractString(expression);
  if (extracted) {
    context.program.stateMap(StateKeys.readonlyWhen).set(target, extracted);
  }
}

export function $disabledWhen(
  context: DecoratorContext,
  target: ModelProperty | Operation,
  expression: unknown,
) {
  const extracted = extractString(expression);
  if (extracted) {
    context.program.stateMap(StateKeys.disabledWhen).set(target, extracted);
  }
}

export function $match(
  context: DecoratorContext,
  target: ModelProperty,
  fieldName: unknown,
) {
  const extracted = extractString(fieldName);
  if (extracted) {
    context.program.stateMap(StateKeys.match).set(target, extracted);
  }
}

export function $rule(
  context: DecoratorContext,
  target: Model,
  options: unknown,
) {
  const extracted = extractRecord(options);
  if (!extracted) {
    return;
  }

  const kind = extractString(extracted.kind);
  if (!kind) {
    return;
  }

  prependStateArray<Model, RuleDef>(context, StateKeys.rule, target, {
    kind,
    fields: extractStringArray(extracted.fields),
    field: extractString(extracted.field),
    left: extractString(extracted.left),
    right: extractString(extracted.right),
    operator: extractString(extracted.operator),
    when: extractString(extracted.when),
    message: extractString(extracted.message),
  });
}

export function getEntity(
  program: DecoratorContext["program"],
  target: Model,
): EntityDef | undefined {
  return program.stateMap(StateKeys.entity).get(target);
}

export function getField(
  program: DecoratorContext["program"],
  target: ModelProperty,
): FieldDef | undefined {
  return program.stateMap(StateKeys.field).get(target);
}

export function getListView(
  program: DecoratorContext["program"],
  target: Model,
): ListViewDef | undefined {
  return program.stateMap(StateKeys.listView).get(target);
}

export function getShowView(
  program: DecoratorContext["program"],
  target: Model,
): RecordViewDef | undefined {
  return program.stateMap(StateKeys.showView).get(target);
}

export function getFormView(
  program: DecoratorContext["program"],
  target: Model,
): RecordViewDef | undefined {
  return program.stateMap(StateKeys.formView).get(target);
}

export function getNamedFilters(
  program: DecoratorContext["program"],
  target: Model,
): NamedFilterDef[] | undefined {
  return getListView(program, target)?.namedFilters;
}

export function getRelation(
  program: DecoratorContext["program"],
  target: ModelProperty,
): RelationDef | undefined {
  return program.stateMap(StateKeys.relation).get(target);
}

export function getNested(
  program: DecoratorContext["program"],
  target: ModelProperty,
): NestedDef | undefined {
  return program.stateMap(StateKeys.nested).get(target);
}

export function getSections(
  program: DecoratorContext["program"],
  target: Model,
): SectionDef[] | undefined {
  return program.stateMap(StateKeys.section).get(target);
}

export function isHidden(
  program: DecoratorContext["program"],
  target: ModelProperty,
): boolean {
  return program.stateSet(StateKeys.hidden).has(target);
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

export function getOptions(
  program: DecoratorContext["program"],
  target: ModelProperty,
): OptionDef[] | undefined {
  return program.stateMap(StateKeys.options).get(target);
}

export function getOptionSource(
  program: DecoratorContext["program"],
  target: ModelProperty,
): OptionSourceDef | undefined {
  return program.stateMap(StateKeys.optionSource).get(target);
}

export function getAction(
  program: DecoratorContext["program"],
  target: Operation,
): ActionDef | undefined {
  return program.stateMap(StateKeys.action).get(target);
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

export function getReadonlyWhen(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.readonlyWhen).get(target);
}

export function getDisabledWhen(
  program: DecoratorContext["program"],
  target: ModelProperty | Operation,
): string | undefined {
  return program.stateMap(StateKeys.disabledWhen).get(target);
}

export function getMatch(
  program: DecoratorContext["program"],
  target: ModelProperty,
): string | undefined {
  return program.stateMap(StateKeys.match).get(target);
}

export function getRules(
  program: DecoratorContext["program"],
  target: Model,
): RuleDef[] | undefined {
  return program.stateMap(StateKeys.rule).get(target);
}

export function hasEntity(
  program: DecoratorContext["program"],
  target: Model,
): boolean {
  return program.stateMap(StateKeys.entity).has(target);
}

export function hasField(
  program: DecoratorContext["program"],
  target: ModelProperty,
): boolean {
  return program.stateMap(StateKeys.field).has(target);
}

export function hasAnySpecloomMetadata(
  program: DecoratorContext["program"],
  target: ModelProperty,
): boolean {
  return (
    hasField(program, target) ||
    program.stateMap(StateKeys.relation).has(target) ||
    program.stateMap(StateKeys.nested).has(target) ||
    program.stateMap(StateKeys.options).has(target) ||
    program.stateMap(StateKeys.optionSource).has(target) ||
    program.stateMap(StateKeys.visibleWhen).has(target) ||
    program.stateMap(StateKeys.requiredWhen).has(target) ||
    program.stateMap(StateKeys.readonlyWhen).has(target) ||
    program.stateMap(StateKeys.disabledWhen).has(target) ||
    program.stateMap(StateKeys.match).has(target) ||
    isHidden(program, target) ||
    isComputed(program, target) ||
    isCreateOnly(program, target)
  );
}

export function getLabel(
  _program: DecoratorContext["program"],
  target: Type,
): string | undefined {
  if ("kind" in target && target.kind === "ModelProperty") {
    return getField(_program, target)?.label;
  }
  if ("kind" in target && target.kind === "Model") {
    return getEntity(_program, target)?.label;
  }
  return undefined;
}
