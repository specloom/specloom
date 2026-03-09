import type { ExpressionAst } from "./expression.js";

export type FilterValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[]
  | boolean[]
  | { context: string }
  | { relative: string };

export type FilterExpression =
  | Record<string, never>
  | {
      field: string;
      operator: string;
      value: FilterValue;
    }
  | { and: FilterExpression[] }
  | { or: FilterExpression[] }
  | { not: FilterExpression };

export interface CompiledSpec {
  version: "1";
  resources: Record<string, CompiledResource>;
  inputs?: Record<string, CompiledInput>;
}

export interface CompiledResource {
  name: string;
  meta: CompiledResourceMeta;
  fields: Record<string, CompiledField>;
  views: CompiledViews;
  rules: CompiledRule[];
}

export interface CompiledResourceMeta {
  label: string;
  pluralLabel?: string;
  titleField?: string;
  pageSize?: number;
  client?: Record<string, unknown>;
}

export interface CompiledInput {
  name: string;
  label?: string;
  fields: Record<string, CompiledField>;
  form: {
    sections: CompiledSection[];
  };
  rules: CompiledRule[];
}

export interface CompiledField {
  name: string;
  type: CompiledFieldType;
  key?: boolean;
  hidden?: boolean;
  computed?: boolean;
  createOnly?: boolean;
  ui: CompiledFieldUi;
  validation?: CompiledFieldValidation;
  rules?: CompiledFieldRules;
  options?: CompiledOption[];
  optionsSource?: CompiledOptionSource;
  filter?: CompiledFieldFilter;
  relation?: CompiledRelation;
  nested?: CompiledNested;
  submit: CompiledFieldSubmit;
}

export type CompiledFieldType =
  | { kind: "scalar"; name: string; nullable?: boolean; array?: boolean }
  | { kind: "enum"; name: string; nullable?: boolean; array?: boolean }
  | {
      kind: "relation";
      resource: string;
      cardinality: "one" | "many";
      storage: "scalar" | "object";
    }
  | { kind: "nested"; resource: string; cardinality: "one" | "many" };

export interface CompiledFieldUi {
  label?: string;
  widget?: string;
  appearance?: string;
  section?: string;
  order?: number;
  visibleIn: {
    list: boolean;
    show: boolean;
    form: boolean;
  };
  readonly?: boolean;
  placeholder?: string;
  help?: string;
  defaultValue?: unknown;
  format?: string;
  emptyText?: string;
  display?: {
    list?: {
      field?: string;
      template?: string;
    };
    show?: {
      field?: string;
      template?: string;
    };
  };
  placement?: {
    list?: string;
    show?: string;
    form?: string;
  };
  client?: Record<string, unknown>;
}

export interface CompiledFieldValidation {
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minItems?: number;
  maxItems?: number;
  match?: string;
}

export interface CompiledFieldRules {
  visibleWhen?: ExpressionAst;
  requiredWhen?: ExpressionAst;
  readonlyWhen?: ExpressionAst;
  disabledWhen?: ExpressionAst;
}

export interface CompiledOption {
  value: string | number | boolean;
  label: string;
}

export interface CompiledOptionSource {
  resource?: string;
  op?: string;
  labelField: string;
  valueField: string;
  searchFields?: string[];
}

export interface CompiledFieldFilter {
  operators: string[];
  widget?: string;
  order?: number;
  placement?: "toolbar" | "advanced";
  defaultValue?: unknown;
}

export interface CompiledRelation {
  resource: string;
  kind: "belongsTo" | "hasOne" | "hasMany" | "manyToMany";
  cardinality: "one" | "many";
  labelField: string;
  valueField: string;
  submitField?: string;
  searchFields?: string[];
  lookupResource?: string;
  lookupOp?: string;
  linkTo?: "show" | "edit" | "none";
  creatable?: boolean;
  client?: Record<string, unknown>;
}

export interface CompiledNested {
  resource: string;
  cardinality: "one" | "many";
  minItems?: number;
  maxItems?: number;
  widget?: "inline-form" | "table" | "cards";
  maxDepth: 3;
}

export interface CompiledFieldSubmit {
  field: string;
  shape: "self" | "scalar" | "scalar[]" | "object" | "object[]";
  valueField?: string;
}

export interface CompiledViews {
  list: CompiledListView;
  form: CompiledRecordView;
  show: CompiledRecordView;
}

export interface CompiledListView {
  enabled: boolean;
  columns: CompiledColumn[];
  search?: {
    fields: string[];
  };
  sortable: string[];
  defaultSort?: {
    field: string;
    direction: "asc" | "desc";
  };
  pageSizeOptions?: number[];
  selection: "none" | "single" | "multi";
  clickAction: "none" | "show" | "edit";
  namedFilters: CompiledNamedFilter[];
  pageActions: CompiledAction[];
  rowActions: CompiledAction[];
}

export interface CompiledColumn {
  field: string;
  label: string;
  template?: string;
  sortable: boolean;
  order?: number;
  placement?: string;
}

export interface CompiledNamedFilter {
  id: string;
  label: string;
  order?: number;
  where: FilterExpression;
}

export interface CompiledRecordView {
  enabled: boolean;
  sections: CompiledSection[];
  pageActions: CompiledAction[];
}

export interface CompiledSection {
  id: string;
  label: string;
  view: "form" | "show";
  order?: number;
  placement?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: string[];
}

export interface CompiledAction {
  id: string;
  kind: "page" | "row";
  view: "list" | "show" | "form";
  resource: string;
  label: string;
  placement?: string;
  order?: number;
  icon?: string;
  prominence?: "primary" | "secondary" | "subtle" | "danger";
  confirmMessage?: string;
  selection?: "none" | "selected" | "query";
  args?: Record<string, unknown>;
  input?: string;
  when?: ExpressionAst;
  disabledWhen?: ExpressionAst;
  operation: {
    id: string;
    method: string;
    path: string;
    inputModel?: string;
    outputModel?: string;
  };
  client?: Record<string, unknown>;
}

export interface CompiledRule {
  kind:
    | "requireOneOf"
    | "comparison"
    | "requiredIf"
    | "mutuallyExclusive"
    | "requiredTogether";
  fields?: string[];
  field?: string;
  left?: string;
  right?: string;
  operator?: string;
  when?: ExpressionAst;
  message?: string;
}

export type SpecloomSpec = CompiledSpec;
export type SpecloomResource = CompiledResource;
export type SpecloomInput = CompiledInput;
export type SpecloomField = CompiledField;
export type SpecloomViews = CompiledViews;
export type SpecloomAction = CompiledAction;
export type SpecloomRule = CompiledRule;
export type SpecloomSection = CompiledSection;
export type SpecloomColumn = CompiledColumn;
export type SpecloomNamedFilter = CompiledNamedFilter;

export class SpecError extends Error {
  constructor(
    message: string,
    readonly path?: string,
  ) {
    super(path ? `${message} at ${path}` : message);
    this.name = "SpecError";
  }
}

export function parseSpec(source: string): CompiledSpec {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source) as unknown;
  } catch (error) {
    throw new SpecError(
      error instanceof Error ? error.message : "Invalid JSON",
      "$",
    );
  }

  return validateSpec(parsed);
}

export function isSpec(value: unknown): value is CompiledSpec {
  try {
    validateSpec(value);
    return true;
  } catch {
    return false;
  }
}

export function validateSpec(value: unknown): CompiledSpec {
  const root = expectRecord(value, "$");

  if (root.version !== "1") {
    throw new SpecError(`Expected version "1"`, "$.version");
  }

  const resources = validateResourceMap(root.resources, "$.resources");
  const inputs =
    root.inputs === undefined
      ? undefined
      : validateInputMap(root.inputs, "$.inputs");

  return {
    version: "1",
    resources,
    ...(inputs ? { inputs } : {}),
  };
}

export function normalizeSpec(spec: CompiledSpec): CompiledSpec {
  const validated = validateSpec(spec);

  return {
    ...validated,
    resources: Object.fromEntries(
      Object.entries(validated.resources).map(([name, resource]) => [
        name,
        {
          ...resource,
          views: {
            ...resource.views,
            list: {
              ...resource.views.list,
              columns: sortByOptionalOrder(resource.views.list.columns),
              namedFilters: sortByOptionalOrder(
                resource.views.list.namedFilters,
              ),
              pageActions: sortByOptionalOrder(resource.views.list.pageActions),
              rowActions: sortByOptionalOrder(resource.views.list.rowActions),
            },
            form: {
              ...resource.views.form,
              sections: sortByOptionalOrder(resource.views.form.sections),
              pageActions: sortByOptionalOrder(resource.views.form.pageActions),
            },
            show: {
              ...resource.views.show,
              sections: sortByOptionalOrder(resource.views.show.sections),
              pageActions: sortByOptionalOrder(resource.views.show.pageActions),
            },
          },
        },
      ]),
    ),
    inputs: validated.inputs
      ? Object.fromEntries(
          Object.entries(validated.inputs).map(([name, input]) => [
            name,
            {
              ...input,
              form: {
                ...input.form,
                sections: sortByOptionalOrder(input.form.sections),
              },
            },
          ]),
        )
      : undefined,
  };
}

function validateResourceMap(
  value: unknown,
  path: string,
): Record<string, CompiledResource> {
  const record = expectRecord(value, path);
  const result: Record<string, CompiledResource> = {};

  for (const [name, resource] of Object.entries(record)) {
    result[name] = validateResource(resource, `${path}.${name}`, name);
  }

  return result;
}

function validateInputMap(
  value: unknown,
  path: string,
): Record<string, CompiledInput> {
  const record = expectRecord(value, path);
  const result: Record<string, CompiledInput> = {};

  for (const [name, input] of Object.entries(record)) {
    result[name] = validateInput(input, `${path}.${name}`, name);
  }

  return result;
}

function validateResource(
  value: unknown,
  path: string,
  fallbackName: string,
): CompiledResource {
  const record = expectRecord(value, path);
  const fields = validateFieldMap(record.fields, `${path}.fields`);
  const views = validateViews(record.views, `${path}.views`);
  const rules = validateRules(record.rules ?? [], `${path}.rules`);
  const meta = validateResourceMeta(record.meta, `${path}.meta`, fallbackName);

  return {
    name: expectOptionalString(record.name, `${path}.name`) ?? fallbackName,
    meta,
    fields,
    views,
    rules,
  };
}

function validateResourceMeta(
  value: unknown,
  path: string,
  fallbackLabel: string,
): CompiledResourceMeta {
  const record = expectRecord(value, path);

  return {
    label: expectOptionalString(record.label, `${path}.label`) ?? fallbackLabel,
    pluralLabel: expectOptionalString(
      record.pluralLabel,
      `${path}.pluralLabel`,
    ),
    titleField: expectOptionalString(record.titleField, `${path}.titleField`),
    pageSize: expectOptionalNumber(record.pageSize, `${path}.pageSize`),
    client: expectOptionalRecord(record.client, `${path}.client`),
  };
}

function validateInput(
  value: unknown,
  path: string,
  fallbackName: string,
): CompiledInput {
  const record = expectRecord(value, path);
  const form = expectRecord(record.form, `${path}.form`);

  return {
    name: expectOptionalString(record.name, `${path}.name`) ?? fallbackName,
    label: expectOptionalString(record.label, `${path}.label`),
    fields: validateFieldMap(record.fields, `${path}.fields`),
    form: {
      sections: validateSections(
        form.sections ?? [],
        `${path}.form.sections`,
        "form",
      ),
    },
    rules: validateRules(record.rules ?? [], `${path}.rules`),
  };
}

function validateFieldMap(
  value: unknown,
  path: string,
): Record<string, CompiledField> {
  const record = expectRecord(value, path);
  const result: Record<string, CompiledField> = {};

  for (const [name, field] of Object.entries(record)) {
    result[name] = validateField(field, `${path}.${name}`, name);
  }

  return result;
}

function validateField(
  value: unknown,
  path: string,
  fallbackName: string,
): CompiledField {
  const record = expectRecord(value, path);

  return {
    name: expectOptionalString(record.name, `${path}.name`) ?? fallbackName,
    type: validateFieldType(record.type, `${path}.type`),
    key: expectOptionalBoolean(record.key, `${path}.key`),
    hidden: expectOptionalBoolean(record.hidden, `${path}.hidden`),
    computed: expectOptionalBoolean(record.computed, `${path}.computed`),
    createOnly: expectOptionalBoolean(record.createOnly, `${path}.createOnly`),
    ui: validateFieldUi(record.ui ?? {}, `${path}.ui`),
    validation: validateFieldValidation(
      record.validation,
      `${path}.validation`,
    ),
    rules: validateFieldRules(record.rules, `${path}.rules`),
    options: validateOptions(record.options, `${path}.options`),
    optionsSource: validateOptionSource(
      record.optionsSource,
      `${path}.optionsSource`,
    ),
    filter: validateFieldFilter(record.filter, `${path}.filter`),
    relation: validateRelation(record.relation, `${path}.relation`),
    nested: validateNested(record.nested, `${path}.nested`),
    submit: validateFieldSubmit(
      record.submit ?? { field: fallbackName, shape: "self" },
      `${path}.submit`,
      fallbackName,
    ),
  };
}

function validateFieldType(value: unknown, path: string): CompiledFieldType {
  const record = expectRecord(value, path);
  const kind = expectString(record.kind, `${path}.kind`);

  switch (kind) {
    case "scalar":
    case "enum":
      return {
        kind,
        name: expectString(record.name, `${path}.name`),
        nullable: expectOptionalBoolean(record.nullable, `${path}.nullable`),
        array: expectOptionalBoolean(record.array, `${path}.array`),
      };
    case "relation":
      return {
        kind,
        resource: expectString(record.resource, `${path}.resource`),
        cardinality: expectOneOf(
          record.cardinality,
          ["one", "many"],
          `${path}.cardinality`,
        ),
        storage: expectOneOf(
          record.storage,
          ["scalar", "object"],
          `${path}.storage`,
        ),
      };
    case "nested":
      return {
        kind,
        resource: expectString(record.resource, `${path}.resource`),
        cardinality: expectOneOf(
          record.cardinality,
          ["one", "many"],
          `${path}.cardinality`,
        ),
      };
    default:
      throw new SpecError(`Unsupported field type kind "${kind}"`, path);
  }
}

function validateFieldUi(value: unknown, path: string): CompiledFieldUi {
  const record = expectRecord(value, path);
  const visibleIn = expectOptionalRecord(record.visibleIn, `${path}.visibleIn`);
  const display = expectOptionalRecord(record.display, `${path}.display`);
  const placement = expectOptionalRecord(record.placement, `${path}.placement`);

  return {
    label: expectOptionalString(record.label, `${path}.label`),
    widget: expectOptionalString(record.widget, `${path}.widget`),
    appearance: expectOptionalString(record.appearance, `${path}.appearance`),
    section: expectOptionalString(record.section, `${path}.section`),
    order: expectOptionalNumber(record.order, `${path}.order`),
    visibleIn: {
      list:
        expectOptionalBoolean(visibleIn?.list, `${path}.visibleIn.list`) ??
        false,
      show:
        expectOptionalBoolean(visibleIn?.show, `${path}.visibleIn.show`) ??
        true,
      form:
        expectOptionalBoolean(visibleIn?.form, `${path}.visibleIn.form`) ??
        true,
    },
    readonly: expectOptionalBoolean(record.readonly, `${path}.readonly`),
    placeholder: expectOptionalString(
      record.placeholder,
      `${path}.placeholder`,
    ),
    help: expectOptionalString(record.help, `${path}.help`),
    defaultValue: record.defaultValue,
    format: expectOptionalString(record.format, `${path}.format`),
    emptyText: expectOptionalString(record.emptyText, `${path}.emptyText`),
    display: display
      ? {
          list: validateDisplay(display.list, `${path}.display.list`),
          show: validateDisplay(display.show, `${path}.display.show`),
        }
      : undefined,
    placement: placement
      ? {
          list: expectOptionalString(placement.list, `${path}.placement.list`),
          show: expectOptionalString(placement.show, `${path}.placement.show`),
          form: expectOptionalString(placement.form, `${path}.placement.form`),
        }
      : undefined,
    client: expectOptionalRecord(record.client, `${path}.client`),
  };
}

function validateDisplay(
  value: unknown,
  path: string,
): { field?: string; template?: string } | undefined {
  if (value === undefined) {
    return undefined;
  }
  const record = expectRecord(value, path);
  return {
    field: expectOptionalString(record.field, `${path}.field`),
    template: expectOptionalString(record.template, `${path}.template`),
  };
}

function validateFieldValidation(
  value: unknown,
  path: string,
): CompiledFieldValidation | undefined {
  if (value === undefined) {
    return undefined;
  }
  const record = expectRecord(value, path);
  return {
    minValue: expectOptionalNumber(record.minValue, `${path}.minValue`),
    maxValue: expectOptionalNumber(record.maxValue, `${path}.maxValue`),
    minLength: expectOptionalNumber(record.minLength, `${path}.minLength`),
    maxLength: expectOptionalNumber(record.maxLength, `${path}.maxLength`),
    pattern: expectOptionalString(record.pattern, `${path}.pattern`),
    minItems: expectOptionalNumber(record.minItems, `${path}.minItems`),
    maxItems: expectOptionalNumber(record.maxItems, `${path}.maxItems`),
    match: expectOptionalString(record.match, `${path}.match`),
  };
}

function validateFieldRules(
  value: unknown,
  path: string,
): CompiledFieldRules | undefined {
  if (value === undefined) {
    return undefined;
  }
  const record = expectRecord(value, path);
  return {
    visibleWhen: validateExpressionAst(
      record.visibleWhen,
      `${path}.visibleWhen`,
    ),
    requiredWhen: validateExpressionAst(
      record.requiredWhen,
      `${path}.requiredWhen`,
    ),
    readonlyWhen: validateExpressionAst(
      record.readonlyWhen,
      `${path}.readonlyWhen`,
    ),
    disabledWhen: validateExpressionAst(
      record.disabledWhen,
      `${path}.disabledWhen`,
    ),
  };
}

function validateOptions(
  value: unknown,
  path: string,
): CompiledOption[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  return expectArray(value, path).map((entry, index) => {
    const record = expectRecord(entry, `${path}[${index}]`);
    return {
      value: expectPrimitiveOptionValue(
        record.value,
        `${path}[${index}].value`,
      ),
      label: expectString(record.label, `${path}[${index}].label`),
    };
  });
}

function validateOptionSource(
  value: unknown,
  path: string,
): CompiledOptionSource | undefined {
  if (value === undefined) {
    return undefined;
  }
  const record = expectRecord(value, path);
  return {
    resource: expectOptionalString(record.resource, `${path}.resource`),
    op: expectOptionalString(record.op, `${path}.op`),
    labelField: expectString(record.labelField, `${path}.labelField`),
    valueField: expectString(record.valueField, `${path}.valueField`),
    searchFields: expectOptionalStringArray(
      record.searchFields,
      `${path}.searchFields`,
    ),
  };
}

function validateFieldFilter(
  value: unknown,
  path: string,
): CompiledFieldFilter | undefined {
  if (value === undefined) {
    return undefined;
  }
  const record = expectRecord(value, path);
  return {
    operators: expectStringArray(record.operators, `${path}.operators`),
    widget: expectOptionalString(record.widget, `${path}.widget`),
    order: expectOptionalNumber(record.order, `${path}.order`),
    placement: expectOptionalOneOf(
      record.placement,
      ["toolbar", "advanced"],
      `${path}.placement`,
    ),
    defaultValue: record.defaultValue,
  };
}

function validateRelation(
  value: unknown,
  path: string,
): CompiledRelation | undefined {
  if (value === undefined) {
    return undefined;
  }
  const record = expectRecord(value, path);
  return {
    resource: expectString(record.resource, `${path}.resource`),
    kind: expectOneOf(
      record.kind,
      ["belongsTo", "hasOne", "hasMany", "manyToMany"],
      `${path}.kind`,
    ),
    cardinality: expectOneOf(
      record.cardinality,
      ["one", "many"],
      `${path}.cardinality`,
    ),
    labelField: expectString(record.labelField, `${path}.labelField`),
    valueField: expectString(record.valueField, `${path}.valueField`),
    submitField: expectOptionalString(
      record.submitField,
      `${path}.submitField`,
    ),
    searchFields: expectOptionalStringArray(
      record.searchFields,
      `${path}.searchFields`,
    ),
    lookupResource: expectOptionalString(
      record.lookupResource,
      `${path}.lookupResource`,
    ),
    lookupOp: expectOptionalString(record.lookupOp, `${path}.lookupOp`),
    linkTo: expectOptionalOneOf(
      record.linkTo,
      ["show", "edit", "none"],
      `${path}.linkTo`,
    ),
    creatable: expectOptionalBoolean(record.creatable, `${path}.creatable`),
    client: expectOptionalRecord(record.client, `${path}.client`),
  };
}

function validateNested(
  value: unknown,
  path: string,
): CompiledNested | undefined {
  if (value === undefined) {
    return undefined;
  }
  const record = expectRecord(value, path);
  return {
    resource: expectString(record.resource, `${path}.resource`),
    cardinality: expectOneOf(
      record.cardinality,
      ["one", "many"],
      `${path}.cardinality`,
    ),
    minItems: expectOptionalNumber(record.minItems, `${path}.minItems`),
    maxItems: expectOptionalNumber(record.maxItems, `${path}.maxItems`),
    widget: expectOptionalOneOf(
      record.widget,
      ["inline-form", "table", "cards"],
      `${path}.widget`,
    ),
    maxDepth:
      expectOptionalNumber(record.maxDepth, `${path}.maxDepth`) === undefined
        ? 3
        : 3,
  };
}

function validateFieldSubmit(
  value: unknown,
  path: string,
  fallbackField: string,
): CompiledFieldSubmit {
  const record = expectRecord(value, path);
  return {
    field: expectOptionalString(record.field, `${path}.field`) ?? fallbackField,
    shape: expectOneOf(
      record.shape,
      ["self", "scalar", "scalar[]", "object", "object[]"],
      `${path}.shape`,
    ),
    valueField: expectOptionalString(record.valueField, `${path}.valueField`),
  };
}

function validateViews(value: unknown, path: string): CompiledViews {
  const record = expectRecord(value, path);
  return {
    list: validateListView(record.list ?? {}, `${path}.list`),
    form: validateRecordView(record.form ?? {}, `${path}.form`, "form"),
    show: validateRecordView(record.show ?? {}, `${path}.show`, "show"),
  };
}

function validateListView(value: unknown, path: string): CompiledListView {
  const record = expectRecord(value, path);
  return {
    enabled: expectOptionalBoolean(record.enabled, `${path}.enabled`) ?? true,
    columns: validateColumns(record.columns ?? [], `${path}.columns`),
    search: validateSearch(record.search, `${path}.search`),
    sortable:
      expectOptionalStringArray(record.sortable, `${path}.sortable`) ?? [],
    defaultSort: validateDefaultSort(record.defaultSort, `${path}.defaultSort`),
    pageSizeOptions: expectOptionalNumberArray(
      record.pageSizeOptions,
      `${path}.pageSizeOptions`,
    ),
    selection:
      expectOptionalOneOf(
        record.selection,
        ["none", "single", "multi"],
        `${path}.selection`,
      ) ?? "none",
    clickAction:
      expectOptionalOneOf(
        record.clickAction,
        ["none", "show", "edit"],
        `${path}.clickAction`,
      ) ?? "none",
    namedFilters: validateNamedFilters(
      record.namedFilters ?? [],
      `${path}.namedFilters`,
    ),
    pageActions: validateActions(
      record.pageActions ?? [],
      `${path}.pageActions`,
    ),
    rowActions: validateActions(record.rowActions ?? [], `${path}.rowActions`),
  };
}

function validateColumns(value: unknown, path: string): CompiledColumn[] {
  return expectArray(value, path).map((entry, index) => {
    const record = expectRecord(entry, `${path}[${index}]`);
    return {
      field: expectString(record.field, `${path}[${index}].field`),
      label: expectString(record.label, `${path}[${index}].label`),
      template: expectOptionalString(
        record.template,
        `${path}[${index}].template`,
      ),
      sortable:
        expectOptionalBoolean(record.sortable, `${path}[${index}].sortable`) ??
        false,
      order: expectOptionalNumber(record.order, `${path}[${index}].order`),
      placement: expectOptionalString(
        record.placement,
        `${path}[${index}].placement`,
      ),
    };
  });
}

function validateSearch(
  value: unknown,
  path: string,
): { fields: string[] } | undefined {
  if (value === undefined) {
    return undefined;
  }
  const record = expectRecord(value, path);
  return {
    fields: expectStringArray(record.fields, `${path}.fields`),
  };
}

function validateDefaultSort(
  value: unknown,
  path: string,
): { field: string; direction: "asc" | "desc" } | undefined {
  if (value === undefined) {
    return undefined;
  }
  const record = expectRecord(value, path);
  return {
    field: expectString(record.field, `${path}.field`),
    direction: expectOneOf(
      record.direction,
      ["asc", "desc"],
      `${path}.direction`,
    ),
  };
}

function validateNamedFilters(
  value: unknown,
  path: string,
): CompiledNamedFilter[] {
  return expectArray(value, path).map((entry, index) => {
    const record = expectRecord(entry, `${path}[${index}]`);
    return {
      id: expectString(record.id, `${path}[${index}].id`),
      label: expectString(record.label, `${path}[${index}].label`),
      order: expectOptionalNumber(record.order, `${path}[${index}].order`),
      where: validateFilterExpression(
        record.where ?? {},
        `${path}[${index}].where`,
      ),
    };
  });
}

function validateFilterExpression(
  value: unknown,
  path: string,
): FilterExpression {
  const record = expectRecord(value, path);

  if ("and" in record) {
    return {
      and: expectArray(record.and, `${path}.and`).map((entry, index) =>
        validateFilterExpression(entry, `${path}.and[${index}]`),
      ),
    };
  }

  if ("or" in record) {
    return {
      or: expectArray(record.or, `${path}.or`).map((entry, index) =>
        validateFilterExpression(entry, `${path}.or[${index}]`),
      ),
    };
  }

  if ("not" in record) {
    return {
      not: validateFilterExpression(record.not, `${path}.not`),
    };
  }

  if (Object.keys(record).length === 0) {
    return {};
  }

  return {
    field: expectString(record.field, `${path}.field`),
    operator: expectString(record.operator, `${path}.operator`),
    value: validateFilterValue(record.value, `${path}.value`),
  };
}

function validateFilterValue(value: unknown, path: string): FilterValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.every((entry) => typeof entry === "string")) {
      return value;
    }
    if (value.every((entry) => typeof entry === "number")) {
      return value;
    }
    if (value.every((entry) => typeof entry === "boolean")) {
      return value;
    }
    throw new SpecError("Unsupported array filter value", path);
  }

  const record = expectRecord(value, path);
  if (typeof record.context === "string") {
    return { context: record.context };
  }
  if (typeof record.relative === "string") {
    return { relative: record.relative };
  }

  throw new SpecError("Unsupported filter value", path);
}

function validateRecordView(
  value: unknown,
  path: string,
  view: "form" | "show",
): CompiledRecordView {
  const record = expectRecord(value, path);
  return {
    enabled: expectOptionalBoolean(record.enabled, `${path}.enabled`) ?? true,
    sections: validateSections(record.sections ?? [], `${path}.sections`, view),
    pageActions: validateActions(
      record.pageActions ?? [],
      `${path}.pageActions`,
    ),
  };
}

function validateSections(
  value: unknown,
  path: string,
  fallbackView: "form" | "show",
): CompiledSection[] {
  return expectArray(value, path).map((entry, index) => {
    const record = expectRecord(entry, `${path}[${index}]`);
    return {
      id: expectString(record.id, `${path}[${index}].id`),
      label: expectString(record.label, `${path}[${index}].label`),
      view:
        expectOptionalOneOf(
          record.view,
          ["form", "show"],
          `${path}[${index}].view`,
        ) ?? fallbackView,
      order: expectOptionalNumber(record.order, `${path}[${index}].order`),
      placement: expectOptionalString(
        record.placement,
        `${path}[${index}].placement`,
      ),
      collapsible: expectOptionalBoolean(
        record.collapsible,
        `${path}[${index}].collapsible`,
      ),
      defaultCollapsed: expectOptionalBoolean(
        record.defaultCollapsed,
        `${path}[${index}].defaultCollapsed`,
      ),
      fields: expectStringArray(record.fields, `${path}[${index}].fields`),
    };
  });
}

function validateActions(value: unknown, path: string): CompiledAction[] {
  return expectArray(value, path).map((entry, index) => {
    const record = expectRecord(entry, `${path}[${index}]`);
    const operation = expectRecord(
      record.operation,
      `${path}[${index}].operation`,
    );
    return {
      id: expectString(record.id, `${path}[${index}].id`),
      kind: expectOneOf(record.kind, ["page", "row"], `${path}[${index}].kind`),
      view: expectOneOf(
        record.view,
        ["list", "show", "form"],
        `${path}[${index}].view`,
      ),
      resource: expectString(record.resource, `${path}[${index}].resource`),
      label: expectString(record.label, `${path}[${index}].label`),
      placement: expectOptionalString(
        record.placement,
        `${path}[${index}].placement`,
      ),
      order: expectOptionalNumber(record.order, `${path}[${index}].order`),
      icon: expectOptionalString(record.icon, `${path}[${index}].icon`),
      prominence: expectOptionalOneOf(
        record.prominence,
        ["primary", "secondary", "subtle", "danger"],
        `${path}[${index}].prominence`,
      ),
      confirmMessage: expectOptionalString(
        record.confirmMessage,
        `${path}[${index}].confirmMessage`,
      ),
      selection: expectOptionalOneOf(
        record.selection,
        ["none", "selected", "query"],
        `${path}[${index}].selection`,
      ),
      args: expectOptionalRecord(record.args, `${path}[${index}].args`),
      input: expectOptionalString(record.input, `${path}[${index}].input`),
      when: validateExpressionAst(record.when, `${path}[${index}].when`),
      disabledWhen: validateExpressionAst(
        record.disabledWhen,
        `${path}[${index}].disabledWhen`,
      ),
      operation: {
        id: expectString(operation.id, `${path}[${index}].operation.id`),
        method: expectString(
          operation.method,
          `${path}[${index}].operation.method`,
        ),
        path: expectString(operation.path, `${path}[${index}].operation.path`),
        inputModel: expectOptionalString(
          operation.inputModel,
          `${path}[${index}].operation.inputModel`,
        ),
        outputModel: expectOptionalString(
          operation.outputModel,
          `${path}[${index}].operation.outputModel`,
        ),
      },
      client: expectOptionalRecord(record.client, `${path}[${index}].client`),
    };
  });
}

function validateRules(value: unknown, path: string): CompiledRule[] {
  return expectArray(value, path).map((entry, index) => {
    const record = expectRecord(entry, `${path}[${index}]`);
    return {
      kind: expectOneOf(
        record.kind,
        [
          "requireOneOf",
          "comparison",
          "requiredIf",
          "mutuallyExclusive",
          "requiredTogether",
        ],
        `${path}[${index}].kind`,
      ),
      fields: expectOptionalStringArray(
        record.fields,
        `${path}[${index}].fields`,
      ),
      field: expectOptionalString(record.field, `${path}[${index}].field`),
      left: expectOptionalString(record.left, `${path}[${index}].left`),
      right: expectOptionalString(record.right, `${path}[${index}].right`),
      operator: expectOptionalString(
        record.operator,
        `${path}[${index}].operator`,
      ),
      when: validateExpressionAst(record.when, `${path}[${index}].when`),
      message: expectOptionalString(
        record.message,
        `${path}[${index}].message`,
      ),
    };
  });
}

function validateExpressionAst(
  value: unknown,
  path: string,
): ExpressionAst | undefined {
  if (value === undefined) {
    return undefined;
  }

  const record = expectRecord(value, path);
  const type = expectString(record.type, `${path}.type`);

  switch (type) {
    case "literal":
      if (
        record.value === null ||
        typeof record.value === "string" ||
        typeof record.value === "number" ||
        typeof record.value === "boolean"
      ) {
        return { type, value: record.value };
      }
      throw new SpecError("Invalid literal value", `${path}.value`);
    case "identifier":
      return { type, path: expectString(record.path, `${path}.path`) };
    case "comparison":
      return {
        type,
        operator: expectOneOf(
          record.operator,
          ["==", "!=", ">", ">=", "<", "<="],
          `${path}.operator`,
        ),
        left: validateExpressionAst(
          record.left,
          `${path}.left`,
        ) as ExpressionAst,
        right: validateExpressionAst(
          record.right,
          `${path}.right`,
        ) as ExpressionAst,
      };
    case "logical":
      return {
        type,
        operator: expectOneOf(
          record.operator,
          ["&&", "||"],
          `${path}.operator`,
        ),
        left: validateExpressionAst(
          record.left,
          `${path}.left`,
        ) as ExpressionAst,
        right: validateExpressionAst(
          record.right,
          `${path}.right`,
        ) as ExpressionAst,
      };
    case "unary":
      return {
        type,
        operator: expectOneOf(record.operator, ["!"], `${path}.operator`),
        operand: validateExpressionAst(
          record.operand,
          `${path}.operand`,
        ) as ExpressionAst,
      };
    default:
      throw new SpecError(`Unsupported expression type "${type}"`, path);
  }
}

function sortByOptionalOrder<T extends { order?: number }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftOrder = left.item.order ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.item.order ?? Number.MAX_SAFE_INTEGER;
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }
      return left.index - right.index;
    })
    .map(({ item }) => item);
}

function expectRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isPlainRecord(value)) {
    throw new SpecError("Expected object", path);
  }
  return value;
}

function expectOptionalRecord(
  value: unknown,
  path: string,
): Record<string, unknown> | undefined {
  if (value === undefined) {
    return undefined;
  }
  return expectRecord(value, path);
}

function expectArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new SpecError("Expected array", path);
  }
  return value;
}

function expectString(value: unknown, path: string): string {
  if (typeof value !== "string") {
    throw new SpecError("Expected string", path);
  }
  return value;
}

function expectOptionalString(
  value: unknown,
  path: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return expectString(value, path);
}

function expectStringArray(value: unknown, path: string): string[] {
  return expectArray(value, path).map((entry, index) =>
    expectString(entry, `${path}[${index}]`),
  );
}

function expectOptionalStringArray(
  value: unknown,
  path: string,
): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  return expectStringArray(value, path);
}

function expectNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new SpecError("Expected number", path);
  }
  return value;
}

function expectOptionalNumber(
  value: unknown,
  path: string,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  return expectNumber(value, path);
}

function expectOptionalNumberArray(
  value: unknown,
  path: string,
): number[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new SpecError("Expected array", path);
  }
  return value.map((item, index) => expectNumber(item, `${path}[${index}]`));
}

function expectBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") {
    throw new SpecError("Expected boolean", path);
  }
  return value;
}

function expectOptionalBoolean(
  value: unknown,
  path: string,
): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  return expectBoolean(value, path);
}

function expectOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new SpecError(
      `Expected one of ${allowed.map((entry) => `"${entry}"`).join(", ")}`,
      path,
    );
  }
  return value as T;
}

function expectOptionalOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
): T | undefined {
  if (value === undefined) {
    return undefined;
  }
  return expectOneOf(value, allowed, path);
}

function expectPrimitiveOptionValue(
  value: unknown,
  path: string,
): string | number | boolean {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  throw new SpecError("Expected string, number, or boolean", path);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
