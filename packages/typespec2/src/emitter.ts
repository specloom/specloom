import {
  emitFile,
  getMaxItems as getMaxItemsStd,
  getMaxLength as getMaxLengthStd,
  getMinItems as getMinItemsStd,
  getMinLength as getMinLengthStd,
  getPattern as getPatternStd,
  getSourceLocation,
  navigateProgram,
  resolvePath,
  type EmitContext,
  type Model,
  type ModelProperty,
  type Operation,
  type Program,
} from "@typespec/compiler";

import type { SpecloomV2EmitterOptions } from "./lib.js";
import {
  getDisabledWhen,
  getEntity,
  getField,
  getFilter,
  getIndex,
  getMatch,
  getNamedFilters,
  getNested,
  getOptionSource,
  getOptions,
  getPageAction,
  getReadonlyWhen,
  getRelation,
  getRowAction,
  getRules,
  getSections,
  getRequiredWhen,
  getVisibleWhen,
  hasAnySpecloomMetadata,
  hasEntity,
  isComputed,
  isCreateOnly,
  isHidden,
  type ActionDef,
  type FieldDef,
  type IndexDef,
  type RuleDef,
  type SectionDef,
} from "./decorators.js";
import { parseExpression, type ExpressionAst } from "./expression.js";

interface CompiledSpecV2 {
  version: "2";
  resources: Record<string, CompiledResource>;
  inputs?: Record<string, CompiledInput>;
}

interface CompiledResource {
  name: string;
  meta: {
    label: string;
    pluralLabel?: string;
    titleField?: string;
    pageSize?: number;
    client?: Record<string, unknown>;
  };
  fields: Record<string, CompiledField>;
  views: {
    list: CompiledListView;
    form: CompiledRecordView;
    show: CompiledRecordView;
  };
  rules: CompiledRule[];
}

interface CompiledInput {
  name: string;
  label?: string;
  fields: Record<string, CompiledField>;
  form: {
    sections: CompiledSection[];
  };
  rules: CompiledRule[];
}

interface CompiledField {
  name: string;
  type: CompiledFieldType;
  key?: boolean;
  hidden?: boolean;
  computed?: boolean;
  createOnly?: boolean;
  ui: {
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
  };
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minItems?: number;
    maxItems?: number;
    match?: string;
  };
  rules?: {
    visibleWhen?: ExpressionAst;
    requiredWhen?: ExpressionAst;
    readonlyWhen?: ExpressionAst;
    disabledWhen?: ExpressionAst;
  };
  options?: { value: string | number | boolean; label: string }[];
  optionsSource?: {
    resource?: string;
    op?: string;
    labelField: string;
    valueField: string;
    searchFields?: string[];
  };
  filter?: {
    operators: string[];
    widget?: string;
    order?: number;
    placement?: "toolbar" | "advanced";
    defaultValue?: unknown;
  };
  relation?: {
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
  };
  nested?: {
    resource: string;
    cardinality: "one" | "many";
    minItems?: number;
    maxItems?: number;
    widget?: "inline-form" | "table" | "cards";
    maxDepth: 3;
  };
  submit: {
    field: string;
    shape: "self" | "scalar" | "scalar[]" | "object" | "object[]";
    valueField?: string;
  };
}

type CompiledFieldType =
  | { kind: "scalar"; name: string; nullable?: boolean; array?: boolean }
  | { kind: "enum"; name: string; nullable?: boolean; array?: boolean }
  | {
      kind: "relation";
      resource: string;
      cardinality: "one" | "many";
      storage: "scalar" | "object";
    }
  | { kind: "nested"; resource: string; cardinality: "one" | "many" };

interface CompiledListView {
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
  selection: "none" | "single" | "multi";
  clickAction: "none" | "show" | "edit";
  namedFilters: CompiledNamedFilter[];
  pageActions: CompiledAction[];
  rowActions: CompiledAction[];
}

interface CompiledColumn {
  field: string;
  label: string;
  template?: string;
  sortable: boolean;
  order?: number;
  placement?: string;
}

interface CompiledNamedFilter {
  id: string;
  label: string;
  order?: number;
  where: FilterExpression;
}

interface CompiledRecordView {
  enabled: boolean;
  sections: CompiledSection[];
  pageActions: CompiledAction[];
}

interface CompiledSection {
  id: string;
  label: string;
  view: "form" | "show";
  order?: number;
  placement?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: string[];
}

interface CompiledAction {
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

interface CompiledRule {
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

type FilterExpression =
  | Record<string, never>
  | {
      field: string;
      operator: string;
      value:
        | string
        | number
        | boolean
        | null
        | string[]
        | number[]
        | boolean[]
        | { context: string }
        | { relative: string };
    }
  | { and: FilterExpression[] }
  | { or: FilterExpression[] }
  | { not: FilterExpression };

export async function $onEmit(context: EmitContext<SpecloomV2EmitterOptions>) {
  if (context.program.compilerOptions.noEmit) {
    return;
  }

  const spec = buildCompiledSpec(context.program);
  const outputFile = context.options["output-file"]?.trim();
  const outputRoot = getOutputRoot(context.emitterOutputDir);

  if (outputFile) {
    await emitFile(context.program, {
      path: resolvePath(outputRoot, outputFile),
      content: JSON.stringify(spec, null, 2) + "\n",
    });
    return;
  }

  for (const [resourceName, resource] of Object.entries(spec.resources)) {
    const partial = createResourceSpec(spec, resourceName, resource);
    await emitFile(context.program, {
      path: resolvePath(outputRoot, `${toKebabCase(resourceName)}.json`),
      content: JSON.stringify(partial, null, 2) + "\n",
    });
  }
}

function buildCompiledSpec(program: Program): CompiledSpecV2 {
  const models: Model[] = [];
  const operations: Operation[] = [];

  navigateProgram(program, {
    model(model: Model) {
      if (
        isLocalDeclaration(model) &&
        model.name &&
        model.properties.size > 0
      ) {
        models.push(model);
      }
    },
    operation(operation: Operation) {
      if (isLocalDeclaration(operation) && operation.name) {
        operations.push(operation);
      }
    },
  });

  const actionInputModels = new Set<Model>();
  const referencedResourceNames = new Set<string>();
  const actionsByResource = new Map<string, CompiledAction[]>();

  for (const operation of operations) {
    const pageAction = getPageAction(program, operation);
    const rowAction = getRowAction(program, operation);
    const def = pageAction ?? rowAction;
    if (!def) {
      continue;
    }

    referencedResourceNames.add(def.resource);
    if (def.inputModel) {
      actionInputModels.add(def.inputModel);
    }

    const compiled = buildAction(program, operation, def);
    const existing = actionsByResource.get(def.resource) ?? [];
    existing.push(compiled);
    actionsByResource.set(def.resource, existing);
  }

  const resources: Record<string, CompiledResource> = {};
  for (const model of models) {
    if (actionInputModels.has(model)) {
      continue;
    }
    if (!shouldCompileResource(program, model, referencedResourceNames)) {
      continue;
    }
    resources[model.name] = buildResource(program, model);
  }

  for (const resourceName of referencedResourceNames) {
    resources[resourceName] ??= createEmptyResource(resourceName);
  }

  for (const [resourceName, actions] of actionsByResource) {
    const resource =
      resources[resourceName] ?? createEmptyResource(resourceName);
    resources[resourceName] = attachActions(resource, actions);
  }

  const inputs: Record<string, CompiledInput> = {};
  for (const model of actionInputModels) {
    inputs[model.name] = buildInput(program, model);
  }

  return {
    version: "2",
    resources,
    ...(Object.keys(inputs).length > 0 ? { inputs } : {}),
  };
}

function shouldCompileResource(
  program: Program,
  model: Model,
  referencedResourceNames: Set<string>,
): boolean {
  if (hasEntity(program, model) || referencedResourceNames.has(model.name)) {
    return true;
  }

  for (const [, prop] of model.properties) {
    if (hasAnySpecloomMetadata(program, prop)) {
      return true;
    }
  }

  return false;
}

function buildResource(program: Program, model: Model): CompiledResource {
  const meta = getEntity(program, model);
  const fields = buildFields(program, model);
  const listMeta = getIndex(program, model);
  const rules = buildRules(program, model);

  return {
    name: model.name,
    meta: {
      label: meta?.label ?? model.name,
      ...(meta?.pluralLabel ? { pluralLabel: meta.pluralLabel } : {}),
      ...(meta?.titleField ? { titleField: meta.titleField } : {}),
      ...(meta?.pageSize !== undefined ? { pageSize: meta.pageSize } : {}),
      ...(isRecord(meta?.client) ? { client: meta?.client } : {}),
    },
    fields,
    views: {
      list: buildListView(program, model, fields, listMeta),
      form: buildRecordView(program, model, fields, "form"),
      show: buildRecordView(program, model, fields, "show"),
    },
    rules,
  };
}

function buildInput(program: Program, model: Model): CompiledInput {
  const fields = buildFields(program, model);
  return {
    name: model.name,
    label: getEntity(program, model)?.label,
    fields,
    form: {
      sections: buildSections(program, model, fields, "form"),
    },
    rules: buildRules(program, model),
  };
}

function buildFields(
  program: Program,
  model: Model,
): Record<string, CompiledField> {
  const result: Record<string, CompiledField> = {};
  for (const [, prop] of model.properties) {
    result[prop.name] = buildField(program, prop);
  }
  return result;
}

function buildField(program: Program, prop: ModelProperty): CompiledField {
  const field = getField(program, prop);
  const hidden = isHidden(program, prop);
  const computed = isComputed(program, prop);
  const createOnly = isCreateOnly(program, prop);
  const relation = getRelation(program, prop);
  const nested = getNested(program, prop);
  const relationCardinality = relation?.cardinality ?? inferCardinality(prop);
  const nestedCardinality = nested?.cardinality ?? inferCardinality(prop);
  const relationStorage = inferRelationStorage(prop);
  const type = buildFieldType(
    prop,
    relation?.resource,
    relationCardinality,
    relationStorage,
    nested?.resource,
    nestedCardinality,
  );
  const validation = buildValidation(program, prop);
  const rules = buildFieldRules(program, prop);

  const showVisible = hidden ? false : (field?.show ?? !computed);
  const formVisible = hidden ? false : (field?.form ?? !computed);
  const listVisible = hidden ? false : (field?.list ?? false);

  const compiled: CompiledField = {
    name: prop.name,
    type,
    ...(hasDecoratorNamed(prop, "key") ? { key: true } : {}),
    ...(hidden ? { hidden: true } : {}),
    ...(computed ? { computed: true } : {}),
    ...(createOnly ? { createOnly: true } : {}),
    ui: {
      label: field?.label ?? prop.name,
      widget: field?.widget ?? inferWidget(prop, relation, nested),
      appearance: field?.appearance,
      section: field?.section,
      order: field?.order,
      visibleIn: {
        list: listVisible,
        show: showVisible,
        form: formVisible,
      },
      readonly: field?.readonly,
      placeholder: field?.placeholder,
      help: field?.help,
      defaultValue: field?.defaultValue,
      format: field?.format,
      emptyText: field?.emptyText,
      display: field?.display,
      placement: field?.placement,
      ...(isRecord(field?.client) ? { client: field?.client } : {}),
    },
    ...(validation ? { validation } : {}),
    ...(rules ? { rules } : {}),
    ...(getOptions(program, prop)
      ? { options: getOptions(program, prop) }
      : {}),
    ...(getOptionSource(program, prop)
      ? { optionsSource: getOptionSource(program, prop) }
      : {}),
    ...(normalizeFilter(getFilter(program, prop))
      ? { filter: normalizeFilter(getFilter(program, prop)) }
      : {}),
    ...(relation
      ? {
          relation: {
            resource: relation.resource,
            kind: relation.kind ?? "belongsTo",
            cardinality: relationCardinality,
            labelField: relation.labelField ?? "name",
            valueField: relation.valueField ?? "id",
            submitField: relation.submitField,
            searchFields: relation.searchFields,
            lookupResource: relation.lookupResource,
            lookupOp: relation.lookupOp,
            linkTo: relation.linkTo,
            creatable: relation.creatable,
            ...(isRecord(relation.client) ? { client: relation.client } : {}),
          },
        }
      : {}),
    ...(nested
      ? {
          nested: {
            resource: nested.resource,
            cardinality: nestedCardinality,
            minItems: nested.minItems,
            maxItems: nested.maxItems,
            widget: nested.widget,
            maxDepth: 3 as const,
          },
        }
      : {}),
    submit: buildSubmit(
      prop,
      relation,
      relationCardinality,
      relationStorage,
      nested,
      nestedCardinality,
    ),
  };

  return compiled;
}

function buildListView(
  program: Program,
  model: Model,
  fields: Record<string, CompiledField>,
  listMeta: IndexDef | undefined,
): CompiledListView {
  const entity = getEntity(program, model);
  return {
    enabled: entity?.views?.list?.enabled ?? true,
    columns: buildColumns(fields, listMeta),
    ...(listMeta?.searchable && listMeta.searchable.length > 0
      ? { search: { fields: listMeta.searchable } }
      : {}),
    sortable: listMeta?.sortable ?? [],
    defaultSort: listMeta?.defaultSort ?? entity?.defaultSort,
    selection: listMeta?.selection ?? "none",
    clickAction: listMeta?.clickAction ?? "none",
    namedFilters:
      (getNamedFilters(program, model)?.map((item) => ({
        id: item.id,
        label: item.label,
        ...(item.order !== undefined ? { order: item.order } : {}),
        where: normalizeFilterExpression(item.where),
      })) as CompiledNamedFilter[] | undefined) ?? [],
    pageActions: [],
    rowActions: [],
  };
}

function buildRecordView(
  program: Program,
  model: Model,
  fields: Record<string, CompiledField>,
  view: "form" | "show",
): CompiledRecordView {
  const entity = getEntity(program, model);
  return {
    enabled: entity?.views?.[view]?.enabled ?? true,
    sections: buildSections(program, model, fields, view),
    pageActions: [],
  };
}

function buildSections(
  program: Program,
  model: Model,
  fields: Record<string, CompiledField>,
  view: "form" | "show",
): CompiledSection[] {
  const explicit = (getSections(program, model) ?? []).filter(
    (section) => !section.view || section.view === view,
  );

  const bySection = new Map<string, string[]>();
  for (const field of Object.values(fields)) {
    if (!field.ui.visibleIn[view]) {
      continue;
    }
    const sectionId = field.ui.section ?? "main";
    const existing = bySection.get(sectionId) ?? [];
    existing.push(field.name);
    bySection.set(sectionId, existing);
  }

  if (explicit.length > 0) {
    const sections = explicit.map((section) => ({
      id: section.id,
      label: section.label,
      view,
      ...(section.order !== undefined ? { order: section.order } : {}),
      ...(section.placement ? { placement: section.placement } : {}),
      ...(section.collapsible !== undefined
        ? { collapsible: section.collapsible }
        : {}),
      ...(section.defaultCollapsed !== undefined
        ? { defaultCollapsed: section.defaultCollapsed }
        : {}),
      fields: sortFieldNames(bySection.get(section.id) ?? [], fields),
    }));

    const assigned = new Set(explicit.map((section) => section.id));
    for (const [id, names] of bySection) {
      if (assigned.has(id)) {
        continue;
      }
      sections.push({
        id,
        label: humanizeId(id),
        view,
        fields: sortFieldNames(names, fields),
      });
    }
    return sortSections(sections);
  }

  if (bySection.size === 0) {
    return [];
  }

  const sections: CompiledSection[] = [];
  for (const [id, names] of bySection) {
    sections.push({
      id,
      label: humanizeId(id),
      view,
      fields: sortFieldNames(names, fields),
    });
  }
  return sortSections(sections);
}

function buildRules(program: Program, model: Model): CompiledRule[] {
  return (getRules(program, model) ?? []).map((rule) => ({
    kind: normalizeRuleKind(rule.kind),
    ...(rule.fields ? { fields: rule.fields } : {}),
    ...(rule.field ? { field: rule.field } : {}),
    ...(rule.left ? { left: rule.left } : {}),
    ...(rule.right ? { right: rule.right } : {}),
    ...(rule.operator ? { operator: rule.operator } : {}),
    ...(rule.when ? { when: compileExpression(rule.when) } : {}),
    ...(rule.message ? { message: rule.message } : {}),
  }));
}

function buildValidation(
  program: Program,
  prop: ModelProperty,
): CompiledField["validation"] | undefined {
  const minLength = getMinLengthStd(program, prop);
  const maxLength = getMaxLengthStd(program, prop);
  const pattern = getPatternStd(program, prop);
  const minItems = getMinItemsStd(program, prop);
  const maxItems = getMaxItemsStd(program, prop);
  const match = getMatch(program, prop);

  const validation: NonNullable<CompiledField["validation"]> = {};
  if (minLength !== undefined) {
    validation.minLength = minLength;
  }
  if (maxLength !== undefined) {
    validation.maxLength = maxLength;
  }
  if (pattern !== undefined) {
    validation.pattern = pattern;
  }
  if (minItems !== undefined) {
    validation.minItems = minItems;
  }
  if (maxItems !== undefined) {
    validation.maxItems = maxItems;
  }
  if (match !== undefined) {
    validation.match = match;
  }

  return Object.keys(validation).length > 0 ? validation : undefined;
}

function buildFieldRules(
  program: Program,
  prop: ModelProperty,
): CompiledField["rules"] | undefined {
  const visibleWhen = getVisibleWhen(program, prop);
  const requiredWhen = getRequiredWhen(program, prop);
  const readonlyWhen = getReadonlyWhen(program, prop);
  const disabledWhen = getDisabledWhen(program, prop);

  const rules: NonNullable<CompiledField["rules"]> = {};
  if (visibleWhen) {
    rules.visibleWhen = compileExpression(visibleWhen);
  }
  if (requiredWhen) {
    rules.requiredWhen = compileExpression(requiredWhen);
  }
  if (readonlyWhen) {
    rules.readonlyWhen = compileExpression(readonlyWhen);
  }
  if (disabledWhen) {
    rules.disabledWhen = compileExpression(disabledWhen);
  }

  return Object.keys(rules).length > 0 ? rules : undefined;
}

function buildAction(
  program: Program,
  operation: Operation,
  def: ActionDef,
): CompiledAction {
  const disabledWhen = def.disabledWhen ?? getDisabledWhen(program, operation);
  const inputModelName = def.inputModel?.name;
  return {
    id: def.id,
    kind: def.kind,
    view: def.view,
    resource: def.resource,
    label: def.label ?? def.id,
    placement: def.placement,
    order: def.order,
    icon: def.icon,
    prominence: def.prominence,
    confirmMessage: def.confirmMessage,
    selection: def.selection,
    args: def.args,
    ...(inputModelName ? { input: inputModelName } : {}),
    ...(def.when ? { when: compileExpression(def.when) } : {}),
    ...(disabledWhen ? { disabledWhen: compileExpression(disabledWhen) } : {}),
    operation: {
      id: operation.name,
      method: inferHttpMethod(operation),
      path: inferRoutePath(operation, def.resource),
      ...(inputModelName ? { inputModel: inputModelName } : {}),
      ...(getModelName((operation as { returnType?: unknown }).returnType)
        ? {
            outputModel: getModelName(
              (operation as { returnType?: unknown }).returnType,
            ),
          }
        : {}),
    },
    ...(isRecord(def.client) ? { client: def.client } : {}),
  };
}

function attachActions(
  resource: CompiledResource,
  actions: CompiledAction[],
): CompiledResource {
  const next = structuredClone(resource);
  for (const action of actions) {
    if (action.kind === "row") {
      next.views.list.rowActions.push(action);
      continue;
    }

    if (action.view === "list") {
      next.views.list.pageActions.push(action);
    } else if (action.view === "form") {
      next.views.form.pageActions.push(action);
    } else {
      next.views.show.pageActions.push(action);
    }
  }
  return next;
}

function buildColumns(
  fields: Record<string, CompiledField>,
  listMeta: IndexDef | undefined,
): CompiledColumn[] {
  const sortable = new Set(listMeta?.sortable ?? []);
  if (Array.isArray(listMeta?.columns) && listMeta.columns.length > 0) {
    return listMeta.columns
      .map((column, index) => normalizeColumn(column, fields, sortable, index))
      .filter((column): column is CompiledColumn => column !== undefined);
  }

  return Object.values(fields)
    .filter((field) => field.ui.visibleIn.list)
    .sort((left, right) => (left.ui.order ?? 0) - (right.ui.order ?? 0))
    .map((field) => ({
      field: field.name,
      label: field.ui.label ?? field.name,
      sortable: sortable.has(field.name),
      ...(field.ui.display?.list?.template
        ? { template: field.ui.display.list.template }
        : {}),
      ...(field.ui.placement?.list
        ? { placement: field.ui.placement.list }
        : {}),
    }));
}

function normalizeColumn(
  value: unknown,
  fields: Record<string, CompiledField>,
  sortable: Set<string>,
  index: number,
): CompiledColumn | undefined {
  if (typeof value === "string") {
    const field = fields[value];
    if (!field) {
      return undefined;
    }
    return {
      field: value,
      label: field.ui.label ?? value,
      sortable: sortable.has(value),
      ...(field.ui.display?.list?.template
        ? { template: field.ui.display.list.template }
        : {}),
    };
  }

  if (!isRecord(value) || typeof value.field !== "string") {
    return undefined;
  }

  const field = fields[value.field];
  return {
    field: value.field,
    label:
      typeof value.label === "string"
        ? value.label
        : (field?.ui.label ?? value.field),
    template:
      typeof value.template === "string"
        ? value.template
        : field?.ui.display?.list?.template,
    sortable:
      typeof value.sortable === "boolean"
        ? value.sortable
        : sortable.has(value.field),
    ...(typeof value.order === "number"
      ? { order: value.order }
      : { order: index }),
    ...(typeof value.placement === "string"
      ? { placement: value.placement }
      : {}),
  };
}

function normalizeFilter(
  filter: ReturnType<typeof getFilter>,
): CompiledField["filter"] | undefined {
  if (!filter) {
    return undefined;
  }
  return {
    operators: filter.operators ?? [],
    ...(filter.widget ? { widget: filter.widget } : {}),
    ...(filter.order !== undefined ? { order: filter.order } : {}),
    ...(filter.placement ? { placement: filter.placement } : {}),
    ...(filter.defaultValue !== undefined
      ? { defaultValue: filter.defaultValue }
      : {}),
  };
}

function normalizeFilterExpression(value: unknown): FilterExpression {
  if (!value || typeof value !== "object") {
    return {};
  }
  return value as FilterExpression;
}

function buildSubmit(
  prop: ModelProperty,
  relation: ReturnType<typeof getRelation>,
  relationCardinality: "one" | "many",
  relationStorage: "scalar" | "object",
  nested: ReturnType<typeof getNested>,
  nestedCardinality: "one" | "many",
): CompiledField["submit"] {
  if (relation) {
    return {
      field: relation.submitField ?? prop.name,
      shape:
        relationCardinality === "many"
          ? relationStorage === "scalar"
            ? "scalar[]"
            : "object[]"
          : relationStorage === "scalar"
            ? "scalar"
            : "object",
      ...(relationStorage === "scalar"
        ? { valueField: relation.valueField ?? "id" }
        : {}),
    };
  }

  if (nested) {
    return {
      field: prop.name,
      shape: nestedCardinality === "many" ? "object[]" : "object",
    };
  }

  return {
    field: prop.name,
    shape: "self",
  };
}

function buildFieldType(
  prop: ModelProperty,
  relationResource: string | undefined,
  relationCardinality: "one" | "many",
  relationStorage: "scalar" | "object",
  nestedResource: string | undefined,
  nestedCardinality: "one" | "many",
): CompiledFieldType {
  if (relationResource) {
    return {
      kind: "relation",
      resource: relationResource,
      cardinality: relationCardinality,
      storage: relationStorage,
    };
  }

  if (nestedResource) {
    return {
      kind: "nested",
      resource: nestedResource,
      cardinality: nestedCardinality,
    };
  }

  const type = prop.type;
  switch (type.kind) {
    case "Enum":
      return {
        kind: "enum",
        name: type.name || "string",
        nullable: isOptional(prop),
        array: isArrayType(prop.type),
      };
    default:
      return {
        kind: "scalar",
        name: getTypeString(prop),
        nullable: isOptional(prop),
        array: isArrayType(prop.type),
      };
  }
}

function inferWidget(
  prop: ModelProperty,
  relation: ReturnType<typeof getRelation>,
  nested: ReturnType<typeof getNested>,
): string {
  if (nested) {
    return nested.widget ?? "inline-form";
  }
  if (relation) {
    return "autocomplete";
  }

  const type = getTypeString(prop);
  switch (type) {
    case "boolean":
      return "checkbox";
    case "date":
      return "date";
    case "datetime":
      return "datetime";
    case "int32":
    case "int64":
    case "float32":
    case "float64":
      return "number";
    default:
      return "text";
  }
}

function inferCardinality(prop: ModelProperty): "one" | "many" {
  return isArrayType(prop.type) ? "many" : "one";
}

function inferRelationStorage(prop: ModelProperty): "scalar" | "object" {
  const elementType = getArrayElementType(prop.type) ?? prop.type;
  return elementType.kind === "Model" ? "object" : "scalar";
}

function getArrayElementType(type: ModelProperty["type"]) {
  if (
    type.kind === "Model" &&
    type.name === "Array" &&
    type.templateMapper?.args
  ) {
    const elementType = type.templateMapper.args[0];
    if (elementType && elementType.entityKind === "Type") {
      return elementType;
    }
  }
  return undefined;
}

function isArrayType(type: ModelProperty["type"]): boolean {
  return type.kind === "Model" && type.name === "Array";
}

function isOptional(prop: ModelProperty): boolean {
  return Boolean((prop as { optional?: boolean }).optional);
}

function getTypeString(prop: ModelProperty): string {
  const type = prop.type;

  switch (type.kind) {
    case "Scalar":
      return mapScalarType(type.name);
    case "Model": {
      const elementType = getArrayElementType(type);
      if (elementType) {
        if (elementType.kind === "Model") {
          return `${elementType.name}[]`;
        }
        if (elementType.kind === "Scalar") {
          return `${mapScalarType(elementType.name)}[]`;
        }
        if (elementType.kind === "Enum") {
          return "string[]";
        }
      }
      return type.name;
    }
    case "Enum":
      return "string";
    case "Union":
      return "string";
    default:
      return "string";
  }
}

function mapScalarType(name: string): string {
  const mapping: Record<string, string> = {
    string: "string",
    int32: "int32",
    int64: "int64",
    float32: "float32",
    float64: "float64",
    boolean: "boolean",
    plainDate: "date",
    utcDateTime: "datetime",
    offsetDateTime: "datetime",
  };
  return mapping[name] ?? name;
}

function normalizeRuleKind(kind: string): CompiledRule["kind"] {
  switch (kind) {
    case "comparison":
    case "requiredIf":
    case "mutuallyExclusive":
    case "requiredTogether":
      return kind;
    default:
      return "requireOneOf";
  }
}

function compileExpression(source: string): ExpressionAst {
  return parseExpression(source);
}

function inferHttpMethod(operation: Operation): string {
  const decoratorNames = getDecoratorNames(operation);
  if (decoratorNames.includes("get")) return "GET";
  if (decoratorNames.includes("post")) return "POST";
  if (decoratorNames.includes("put")) return "PUT";
  if (decoratorNames.includes("patch")) return "PATCH";
  if (decoratorNames.includes("delete")) return "DELETE";
  return "POST";
}

function inferRoutePath(operation: Operation, resourceName: string): string {
  const interfaceTarget = (operation as { interface?: unknown }).interface;
  const interfaceRoute = getDecoratorStringArg(interfaceTarget, "route");
  const operationRoute = getDecoratorStringArg(operation, "route");

  const normalizedResource = `/${toKebabCase(resourceName)}`;
  if (interfaceRoute || operationRoute) {
    return joinPaths(interfaceRoute ?? "", operationRoute ?? "");
  }

  return joinPaths(normalizedResource, `/${toKebabCase(operation.name)}`);
}

function getModelName(type: unknown): string | undefined {
  if (!type || typeof type !== "object" || !("entityKind" in type)) {
    return undefined;
  }
  const entity = type as { entityKind: string; kind?: string; name?: string };
  if (entity.entityKind === "Type" && entity.kind === "Model" && entity.name) {
    return entity.name;
  }
  return undefined;
}

function getDecoratorNames(target: unknown): string[] {
  const decorators = getDecorators(target);
  return decorators
    .map((decorator) => getDecoratorName(decorator))
    .filter((name): name is string => Boolean(name));
}

function getDecoratorStringArg(
  target: unknown,
  decoratorName: string,
): string | undefined {
  for (const decorator of getDecorators(target)) {
    const name = getDecoratorName(decorator);
    if (name !== decoratorName) {
      continue;
    }

    const args =
      (decorator as { args?: unknown[]; arguments?: unknown[] }).args ??
      (decorator as { args?: unknown[]; arguments?: unknown[] }).arguments ??
      [];
    const first = args[0];
    const extracted = extractLiteralString(first);
    if (extracted) {
      return extracted;
    }
  }
  return undefined;
}

function getDecorators(target: unknown): unknown[] {
  if (!target || typeof target !== "object") {
    return [];
  }
  const direct = (target as { decorators?: unknown[] }).decorators;
  if (Array.isArray(direct)) {
    return direct;
  }
  const nodeDecorators = (target as { node?: { decorators?: unknown[] } }).node
    ?.decorators;
  return Array.isArray(nodeDecorators) ? nodeDecorators : [];
}

function getDecoratorName(decorator: unknown): string | undefined {
  if (!decorator || typeof decorator !== "object") {
    return undefined;
  }
  const byDecorator = (decorator as { decorator?: { name?: string } }).decorator
    ?.name;
  if (byDecorator) {
    return byDecorator;
  }
  const byTarget = (decorator as { target?: { sv?: string } }).target?.sv;
  if (byTarget) {
    return byTarget;
  }
  const byNode = (decorator as { kind?: string; target?: { kind?: string } })
    .kind;
  return byNode;
}

function extractLiteralString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const direct = (value as { value?: unknown }).value;
    if (typeof direct === "string") {
      return direct;
    }
    const sv = (value as { sv?: string }).sv;
    if (typeof sv === "string") {
      return sv;
    }
  }

  return undefined;
}

function isLocalDeclaration(target: Model | Operation): boolean {
  const location = getSourceLocation(target);
  const path = location?.file?.path;
  return Boolean(
    path && !path.includes("node_modules") && !path.endsWith(".d.ts"),
  );
}

function createEmptyResource(name: string): CompiledResource {
  return {
    name,
    meta: {
      label: name,
    },
    fields: {},
    views: {
      list: {
        enabled: true,
        columns: [],
        sortable: [],
        selection: "none",
        clickAction: "none",
        namedFilters: [],
        pageActions: [],
        rowActions: [],
      },
      form: {
        enabled: true,
        sections: [],
        pageActions: [],
      },
      show: {
        enabled: true,
        sections: [],
        pageActions: [],
      },
    },
    rules: [],
  };
}

function createResourceSpec(
  spec: CompiledSpecV2,
  resourceName: string,
  resource: CompiledResource,
): CompiledSpecV2 {
  const inputNames = collectReferencedInputNames(resource);
  const inputs =
    spec.inputs && inputNames.size > 0
      ? Object.fromEntries(
          [...inputNames]
            .map((name) => [name, spec.inputs?.[name]] as const)
            .filter((entry): entry is [string, CompiledInput] =>
              Boolean(entry[1]),
            ),
        )
      : undefined;

  return {
    version: "2",
    resources: {
      [resourceName]: resource,
    },
    ...(inputs && Object.keys(inputs).length > 0 ? { inputs } : {}),
  };
}

function collectReferencedInputNames(resource: CompiledResource): Set<string> {
  const names = new Set<string>();
  const actions = [
    ...resource.views.list.pageActions,
    ...resource.views.list.rowActions,
    ...resource.views.form.pageActions,
    ...resource.views.show.pageActions,
  ];

  for (const action of actions) {
    if (action.input) {
      names.add(action.input);
    }
  }

  return names;
}

function humanizeId(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase());
}

function sortFieldNames(
  names: string[],
  fields: Record<string, CompiledField>,
): string[] {
  return [...names].sort(
    (left, right) =>
      (fields[left]?.ui.order ?? Number.MAX_SAFE_INTEGER) -
      (fields[right]?.ui.order ?? Number.MAX_SAFE_INTEGER),
  );
}

function sortSections(sections: CompiledSection[]): CompiledSection[] {
  return [...sections].sort(
    (left, right) =>
      (left.order ?? Number.MAX_SAFE_INTEGER) -
      (right.order ?? Number.MAX_SAFE_INTEGER),
  );
}

function joinPaths(left: string, right: string): string {
  const normalizedLeft = left.replace(/\/+$/, "");
  const normalizedRight = right.replace(/^\/+/, "");
  if (!normalizedLeft) {
    return `/${normalizedRight}`;
  }
  if (!normalizedRight) {
    return normalizedLeft.startsWith("/")
      ? normalizedLeft
      : `/${normalizedLeft}`;
  }
  return `${normalizedLeft.startsWith("/") ? normalizedLeft : `/${normalizedLeft}`}/${normalizedRight}`;
}

function getOutputRoot(emitterOutputDir: string): string {
  const normalized = emitterOutputDir.replace(/\\/g, "/");
  const suffix = "/@specloom/typespec2";
  if (normalized.endsWith(suffix)) {
    return emitterOutputDir.slice(0, emitterOutputDir.length - suffix.length);
  }
  return emitterOutputDir;
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

function hasDecoratorNamed(target: unknown, name: string): boolean {
  return getDecoratorNames(target).includes(name);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
