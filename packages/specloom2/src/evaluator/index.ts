import type {
  CompiledAction,
  CompiledField,
  CompiledInput,
  CompiledResource,
} from "@specloom/spec";
import { EvaluatorError } from "../errors.js";
import { evaluateExpression } from "../expression/index.js";
import type {
  ActionVM,
  Context,
  FormFieldVM,
  FormViewModel,
  ListColumnVM,
  ListRowVM,
  ListViewModel,
  RecordSectionVM,
  ShowFieldVM,
  ShowViewModel,
  ValidationErrors,
} from "../vm/types.js";

export interface EvaluateListOptions {
  resource: CompiledResource;
  context: Context;
  data: Record<string, unknown>[];
  activeFilter?: string;
  searchQuery?: string;
  selected?: string[];
}

export interface EvaluateShowOptions {
  resource: CompiledResource;
  context: Context;
  record: Record<string, unknown>;
}

export interface EvaluateFormOptions {
  resource: CompiledResource;
  context: Context;
  mode: "create" | "edit";
  record?: Record<string, unknown>;
  errors?: ValidationErrors;
  isDirty?: boolean;
}

export interface EvaluateInputOptions {
  input: CompiledInput;
  context: Context;
  record?: Record<string, unknown>;
  errors?: ValidationErrors;
  isDirty?: boolean;
}

export function evaluateListView(options: EvaluateListOptions): ListViewModel {
  const { resource, context, data, activeFilter, searchQuery, selected } =
    options;
  const view = resource.views.list;

  if (!view.enabled) {
    throw new EvaluatorError(
      `List view is disabled for resource: ${resource.name}`,
    );
  }

  const columns = view.columns
    .map((column) => {
      const field = resource.fields[column.field];
      if (!field || field.hidden || !field.ui.visibleIn.list) {
        return undefined;
      }
      return { ...column, fieldSpec: field } as ListColumnVM;
    })
    .filter((column): column is ListColumnVM => column !== undefined);

  const rows = data.map((record) =>
    toListRow(record, columns, view.rowActions, context),
  );
  const actions = view.pageActions.map((action) => toAction(action, context));

  return {
    type: "list",
    resource: resource.name,
    label: resource.meta.pluralLabel ?? resource.meta.label,
    columns,
    rows,
    namedFilters: view.namedFilters.map((filter) => ({
      ...filter,
      active: filter.id === activeFilter,
    })),
    search: {
      fields: view.search?.fields ?? [],
      query: searchQuery ?? "",
    },
    selection: {
      mode: view.selection,
      selected: selected ?? [],
    },
    pageActions: actions.filter((action) => action.selection !== "selected"),
    selectionActions: actions.filter(
      (action) => action.selection === "selected",
    ),
    defaultSort: view.defaultSort,
    clickAction: view.clickAction,
  };
}

export function evaluateShowView(options: EvaluateShowOptions): ShowViewModel {
  const { resource, context, record } = options;
  const view = resource.views.show;

  if (!view.enabled) {
    throw new EvaluatorError(
      `Show view is disabled for resource: ${resource.name}`,
    );
  }

  const sections = toShowSections(resource, context, record);
  const fields = sections.flatMap((section) => section.fields);

  return {
    type: "show",
    resource: resource.name,
    label: resource.meta.label,
    id: String(record.id ?? ""),
    fields,
    sections,
    actions: view.pageActions.map((action) =>
      toAction(action, context, record),
    ),
  };
}

export function evaluateFormView(options: EvaluateFormOptions): FormViewModel {
  const { resource, context, mode, record, errors, isDirty } = options;
  const view = resource.views.form;

  if (!view.enabled) {
    throw new EvaluatorError(
      `Form view is disabled for resource: ${resource.name}`,
    );
  }

  const source = record ?? {};
  const sections = toFormSections(resource, context, source, mode, errors);
  const fields = sections.flatMap((section) => section.fields);

  return {
    type: "form",
    resource: resource.name,
    label: resource.meta.label,
    mode,
    id: source.id != null ? String(source.id) : undefined,
    fields,
    sections,
    actions: view.pageActions.map((action) =>
      toAction(action, context, source),
    ),
    isValid: fields.every((field) => field.errors.length === 0),
    isDirty: isDirty ?? false,
  };
}

export function evaluateInputForm(
  options: EvaluateInputOptions,
): FormViewModel {
  const { input, context, record, errors, isDirty } = options;
  const source = record ?? {};
  const sections: RecordSectionVM<FormFieldVM>[] = [];

  for (const section of input.form.sections) {
    const fields = section.fields
      .map((fieldName) =>
        toFormField(
          input.fields[fieldName],
          context,
          source,
          "create",
          errors?.[fieldName] ?? [],
        ),
      )
      .filter((field): field is FormFieldVM => field !== undefined);

    if (fields.length === 0) {
      continue;
    }

    sections.push({
      id: section.id,
      label: section.label,
      placement: section.placement,
      collapsible: section.collapsible,
      defaultCollapsed: section.defaultCollapsed,
      fields,
      source: section,
    });
  }

  return {
    type: "form",
    resource: input.name,
    label: input.label ?? input.name,
    mode: "create",
    fields: sections.flatMap((section) => section.fields),
    sections,
    actions: [],
    isValid: sections.every((section) =>
      section.fields.every((field) => field.errors.length === 0),
    ),
    isDirty: isDirty ?? false,
  };
}

function toListRow(
  record: Record<string, unknown>,
  columns: ListColumnVM[],
  rowActions: CompiledAction[],
  context: Context,
): ListRowVM {
  const values: Record<string, unknown> = {};

  for (const column of columns) {
    values[column.field] = record[column.field];
  }

  return {
    id: String(record.id ?? ""),
    record,
    values,
    actions: rowActions.map((action) => toAction(action, context, record)),
  };
}

function toShowSections(
  resource: CompiledResource,
  context: Context,
  record: Record<string, unknown>,
): RecordSectionVM<ShowFieldVM>[] {
  const sections: RecordSectionVM<ShowFieldVM>[] = [];

  for (const section of resource.views.show.sections) {
    const fields = section.fields
      .map((fieldName) => {
        const field = resource.fields[fieldName];
        if (!field) {
          throw new EvaluatorError(
            `Field not found: ${resource.name}.${fieldName}`,
          );
        }
        return toShowField(field, context, record);
      })
      .filter((field): field is ShowFieldVM => field !== undefined);

    if (fields.length === 0) {
      continue;
    }

    sections.push({
      id: section.id,
      label: section.label,
      placement: section.placement,
      collapsible: section.collapsible,
      defaultCollapsed: section.defaultCollapsed,
      fields,
      source: section,
    });
  }

  return sections;
}

function toFormSections(
  resource: CompiledResource,
  context: Context,
  record: Record<string, unknown>,
  mode: "create" | "edit",
  errors?: ValidationErrors,
): RecordSectionVM<FormFieldVM>[] {
  const sections: RecordSectionVM<FormFieldVM>[] = [];

  for (const section of resource.views.form.sections) {
    const fields = section.fields
      .map((fieldName) => {
        const field = resource.fields[fieldName];
        if (!field) {
          throw new EvaluatorError(
            `Field not found: ${resource.name}.${fieldName}`,
          );
        }
        return toFormField(
          field,
          context,
          record,
          mode,
          errors?.[fieldName] ?? [],
        );
      })
      .filter((field): field is FormFieldVM => field !== undefined);

    if (fields.length === 0) {
      continue;
    }

    sections.push({
      id: section.id,
      label: section.label,
      placement: section.placement,
      collapsible: section.collapsible,
      defaultCollapsed: section.defaultCollapsed,
      fields,
      source: section,
    });
  }

  return sections;
}

function toShowField(
  field: CompiledField,
  context: Context,
  record: Record<string, unknown>,
): ShowFieldVM | undefined {
  const visible = isFieldVisible(field, "show", context, record);
  if (!visible) {
    return undefined;
  }

  return {
    name: field.name,
    label: field.ui.label ?? field.name,
    type: field.type,
    value: record[field.name] ?? field.ui.defaultValue,
    visible,
    hidden: field.hidden === true,
    ui: field.ui,
    validation: field.validation,
    options: field.options,
    optionsSource: field.optionsSource,
    relation: field.relation,
    nested: field.nested,
    submit: field.submit,
  };
}

function toFormField(
  field: CompiledField | undefined,
  context: Context,
  record: Record<string, unknown>,
  mode: "create" | "edit",
  errors: string[],
): FormFieldVM | undefined {
  if (!field) {
    return undefined;
  }

  const visible = isFieldVisible(field, "form", context, record);
  if (!visible) {
    return undefined;
  }

  const readonly =
    field.ui.readonly === true ||
    field.computed === true ||
    (mode === "edit" && field.createOnly === true) ||
    evaluateExpression(field.rules?.readonlyWhen, context, record, false);

  const disabled = evaluateExpression(
    field.rules?.disabledWhen,
    context,
    record,
    false,
  );

  return {
    name: field.name,
    label: field.ui.label ?? field.name,
    type: field.type,
    value: record[field.name] ?? field.ui.defaultValue,
    visible,
    hidden: field.hidden === true,
    required:
      isFieldRequiredByType(field) ||
      evaluateExpression(field.rules?.requiredWhen, context, record, false),
    readonly,
    disabled,
    errors,
    ui: field.ui,
    validation: field.validation,
    options: field.options,
    optionsSource: field.optionsSource,
    relation: field.relation,
    nested: field.nested,
    submit: field.submit,
  };
}

function toAction(
  action: CompiledAction,
  context: Context,
  record: Record<string, unknown> = {},
): ActionVM {
  const visible = evaluateExpression(action.when, context, record, true);
  const disabled = evaluateExpression(
    action.disabledWhen,
    context,
    record,
    false,
  );

  return {
    id: action.id,
    kind: action.kind,
    view: action.view,
    resource: action.resource,
    label: action.label,
    visible,
    disabled,
    allowed: visible && !disabled,
    selection: action.selection ?? "none",
    placement: action.placement,
    order: action.order,
    icon: action.icon,
    prominence: action.prominence,
    confirmMessage: action.confirmMessage,
    args: action.args,
    input: action.input,
    operation: action.operation,
    client: action.client,
  };
}

function isFieldVisible(
  field: CompiledField,
  view: "list" | "show" | "form",
  context: Context,
  record: Record<string, unknown>,
): boolean {
  if (field.hidden === true) {
    return false;
  }
  if (!field.ui.visibleIn[view]) {
    return false;
  }
  return evaluateExpression(field.rules?.visibleWhen, context, record, true);
}

function isFieldRequiredByType(field: CompiledField): boolean {
  switch (field.type.kind) {
    case "scalar":
    case "enum":
      return field.type.nullable !== true && field.type.array !== true;
    case "relation":
    case "nested":
      return field.type.cardinality === "one";
  }
}
