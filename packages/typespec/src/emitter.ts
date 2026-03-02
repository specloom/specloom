import {
  emitFile,
  resolvePath,
  navigateProgram,
  getSourceLocation,
  getMinLength as getMinLengthStd,
  getMaxLength as getMaxLengthStd,
  getPattern as getPatternStd,
  getMinItems as getMinItemsStd,
  getMaxItems as getMaxItemsStd,
  type EmitContext,
  type Model,
  type ModelProperty,
  type Program,
} from "@typespec/compiler";

import type { SpecloomEmitterOptions } from "./lib.js";
import {
  getResourceName,
  getRequiredOneOf,
  getLabel,
  getKind,
  getOptions,
  getRelation,
  getCardinality,
  getUI,
  isReadonly,
  isComputed,
  isCreateOnly,
  isRequired,
  getFilter,
  getView,
  getColumns,
  getFields,
  getSearchable,
  getSortable,
  getDefaultSort,
  getClickAction,
  getSelection,
  getNamedFilters,
  getViewActions,
  getViewRowActions,
  getVisibleWhen,
  getRequiredWhen,
  getMatch,
  getMin,
  getMax,
  getMinLength,
  getMaxLength,
  getPattern,
  getMinItems,
  getMaxItems,
  getNested,
  type ViewActionDef,
} from "./decorators.js";

interface Spec {
  version: "0.1";
  resources: Resource[];
  views: View[];
}

interface Resource {
  name: string;
  label?: string;
  fields: Field[];
  validation?: {
    requiredOneOf?: string[][];
  };
}

interface Field {
  name: string;
  type: string;
  label?: string;
  kind?: string;
  required?: boolean;
  readonly?: boolean;
  computed?: boolean;
  createOnly?: boolean;
  filter?: true | string[];
  visibleWhen?: string;
  requiredWhen?: string;
  options?: { value: string; label: string }[];
  relation?: {
    resource: string;
    labelField?: string;
    valueField?: string;
    searchable?: boolean;
    cardinality?: string;
  };
  nested?: {
    resource: string;
    min?: number;
    max?: number;
  };
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    match?: string;
    minItems?: number;
    maxItems?: number;
  };
  ui?: Record<string, unknown>;
}

interface View {
  resource: string;
  type: "list" | "form" | "show";
  columns?: string[];
  fields?: string[];
  searchable?: string[];
  sortable?: string[];
  defaultSort?: { field: string; order: string };
  clickAction?: string;
  selectionMode?: string;
  namedFilters?: { id: string; label: string; filter: unknown }[];
  actions: Action[];
  rowActions?: Action[];
}

interface Action {
  id: string;
  label: string;
  selection?: "selected" | "query";
  allowedWhen?: string;
  confirm?: string | true;
  ui?: Record<string, unknown>;
  dialog?: {
    title?: string;
    description?: string;
    fields: DialogField[];
  };
  api?: {
    path: string;
    method: string;
    params?: unknown;
    body?: string[];
    query?: unknown;
  };
}

interface DialogField {
  name: string;
  label?: string;
  kind?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    match?: string;
  };
}

export async function $onEmit(context: EmitContext<SpecloomEmitterOptions>) {
  if (context.program.compilerOptions.noEmit) {
    return;
  }

  const specs = buildSpecsBySourceFile(context.program);

  for (const [sourceFile, spec] of specs) {
    // Skip empty specs
    if (spec.resources.length === 0 && spec.views.length === 0) {
      continue;
    }

    // Convert .tsp to .json
    const outputFile = sourceFile.replace(/\.tsp$/, ".json");

    await emitFile(context.program, {
      path: resolvePath(context.emitterOutputDir, outputFile),
      content: JSON.stringify(spec, null, 2) + "\n",
    });
  }
}

function getSourceFileName(model: Model, program: Program): string | undefined {
  const location = getSourceLocation(model);
  if (!location?.file) {
    return undefined;
  }
  // Get relative path from project root to preserve directory structure
  const filePath = location.file.path;
  const projectRoot = program.projectRoot + "/";
  if (filePath.startsWith(projectRoot)) {
    return filePath.slice(projectRoot.length);
  }
  // Fallback: just the filename
  const lastSlash = filePath.lastIndexOf("/");
  return lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath;
}

function buildSpecsBySourceFile(program: Program): Map<string, Spec> {
  const specsByFile = new Map<
    string,
    { resources: Resource[]; views: View[] }
  >();

  // Collect resources and views grouped by source file
  navigateProgram(program, {
    model(model) {
      const sourceFile = getSourceFileName(model, program);
      if (!sourceFile) {
        return;
      }

      // Skip library files (from node_modules or lib folder)
      if (sourceFile.includes("node_modules") || sourceFile.endsWith(".d.ts")) {
        return;
      }

      if (!specsByFile.has(sourceFile)) {
        specsByFile.set(sourceFile, { resources: [], views: [] });
      }
      const spec = specsByFile.get(sourceFile)!;

      const resourceName = getResourceName(program, model);
      if (resourceName) {
        spec.resources.push(buildResource(program, model));
      }

      const viewInfo = getView(program, model);
      if (viewInfo) {
        spec.views.push(buildView(program, model));
      }
    },
  });

  // Convert to Spec format
  const result = new Map<string, Spec>();
  for (const [file, data] of specsByFile) {
    result.set(file, {
      version: "0.1",
      resources: data.resources,
      views: data.views,
    });
  }

  return result;
}

function buildResource(program: Program, model: Model): Resource {
  const resourceName = getResourceName(program, model)!;
  const label = getLabel(program, model);
  const requiredOneOf = getRequiredOneOf(program, model);
  const fields: Field[] = [];

  for (const [, prop] of model.properties) {
    // Skip computed fields from resource (they're not in DB)
    if (isComputed(program, prop)) {
      continue;
    }
    fields.push(buildField(program, prop));
  }

  const resource: Resource = {
    name: resourceName,
    fields,
  };

  if (label) {
    resource.label = label;
  }

  if (requiredOneOf && requiredOneOf.length > 0) {
    resource.validation = {
      requiredOneOf,
    };
  }

  return resource;
}

function buildField(program: Program, prop: ModelProperty): Field {
  const field: Field = {
    name: prop.name,
    type: getTypeString(prop),
  };

  const label = getLabel(program, prop);
  if (label) {
    field.label = label;
  }

  // Handle enum type: auto-generate kind and options
  if (prop.type.kind === "Enum") {
    field.kind = "enum";
    field.options = [];
    for (const member of prop.type.members.values()) {
      const value = member.value ?? member.name;
      field.options.push({
        value: String(value),
        label: String(value),
      });
    }
  }

  const kind = getKind(program, prop);
  if (kind) {
    field.kind = kind;
  }

  const required = isRequired(program, prop);
  if (required) {
    field.required = true;
  }

  const readonly = isReadonly(program, prop);
  if (readonly) {
    field.readonly = true;
  }

  const createOnly = isCreateOnly(program, prop);
  if (createOnly) {
    field.createOnly = true;
  }

  const filter = getFilter(program, prop);
  if (filter !== undefined) {
    field.filter = filter;
  }

  // Manual options override auto-generated enum options
  const options = getOptions(program, prop);
  if (options) {
    field.options = options;
  }

  const relation = getRelation(program, prop);
  if (relation) {
    const cardinality = getCardinality(program, prop);
    field.relation = {
      ...relation,
      ...(cardinality ? { cardinality } : {}),
    };
  }

  const nested = getNested(program, prop);
  if (nested) {
    field.nested = {
      resource: nested.resource,
      ...(nested.min !== undefined ? { min: nested.min } : {}),
      ...(nested.max !== undefined ? { max: nested.max } : {}),
    };
  }

  const visibleWhen = getVisibleWhen(program, prop);
  if (visibleWhen) {
    field.visibleWhen = visibleWhen;
  }

  const requiredWhen = getRequiredWhen(program, prop);
  if (requiredWhen) {
    field.requiredWhen = requiredWhen;
  }

  const ui = getUI(program, prop);
  if (ui && Object.keys(ui).length > 0) {
    field.ui = ui;
  }

  // Build validation
  const validation = buildValidation(program, prop);
  if (validation && Object.keys(validation).length > 0) {
    field.validation = validation;
  }

  return field;
}

function buildValidation(
  program: Program,
  prop: ModelProperty,
): Field["validation"] {
  const validation: NonNullable<Field["validation"]> = {};

  const required = isRequired(program, prop);
  if (required) {
    validation.required = true;
  }

  const minLength =
    getMinLength(program, prop) ?? getMinLengthStd(program, prop);
  if (minLength !== undefined) {
    validation.minLength = minLength;
  }

  const maxLength =
    getMaxLength(program, prop) ?? getMaxLengthStd(program, prop);
  if (maxLength !== undefined) {
    validation.maxLength = maxLength;
  }

  const min = getMin(program, prop);
  if (min !== undefined) {
    validation.min = min;
  }

  const max = getMax(program, prop);
  if (max !== undefined) {
    validation.max = max;
  }

  const pattern = getPattern(program, prop) ?? getPatternStd(program, prop);
  if (pattern !== undefined) {
    validation.pattern = pattern;
  }

  const match = getMatch(program, prop);
  if (match !== undefined) {
    validation.match = match;
  }

  const minItems = getMinItems(program, prop) ?? getMinItemsStd(program, prop);
  if (minItems !== undefined) {
    validation.minItems = minItems;
  }

  const maxItems = getMaxItems(program, prop) ?? getMaxItemsStd(program, prop);
  if (maxItems !== undefined) {
    validation.maxItems = maxItems;
  }

  return validation;
}

function buildView(program: Program, model: Model): View {
  const viewInfo = getView(program, model)!;
  const actions: Action[] = [];
  const rowActions: Action[] = [];

  // View-level action decorators (Model target)
  const viewActionDefs = getViewActions(program, model);
  const viewRowActionDefs = getViewRowActions(program, model);

  if (viewActionDefs) {
    for (const def of viewActionDefs) {
      actions.push(buildActionFromDef(program, def));
    }
  }
  if (viewRowActionDefs) {
    for (const def of viewRowActionDefs) {
      rowActions.push(buildActionFromDef(program, def));
    }
  }

  const view: View = {
    resource: viewInfo.resource,
    type: viewInfo.type as View["type"],
    actions,
  };

  // Only include rowActions for list views
  if (viewInfo.type === "list" && rowActions.length > 0) {
    view.rowActions = rowActions;
  }

  if (viewInfo.type === "list") {
    const columns = getColumns(program, model);
    if (columns) {
      view.columns = columns;
    }

    const searchable = getSearchable(program, model);
    if (searchable) {
      view.searchable = searchable;
    }

    const sortable = getSortable(program, model);
    if (sortable) {
      view.sortable = sortable;
    }

    const defaultSort = getDefaultSort(program, model);
    if (defaultSort) {
      view.defaultSort = defaultSort;
    }

    const clickAction = getClickAction(program, model);
    if (clickAction) {
      view.clickAction = clickAction;
    }

    const selectionMode = getSelection(program, model);
    if (selectionMode) {
      view.selectionMode = selectionMode;
    }

    const namedFilters = getNamedFilters(program, model);
    if (namedFilters) {
      view.namedFilters = namedFilters;
    }
  } else {
    const fields = getFields(program, model);
    if (fields) {
      view.fields = fields;
    }
  }

  return view;
}

function buildActionFromDef(program: Program, def: ViewActionDef): Action {
  const action: Action = {
    id: def.id,
    label: def.label ?? def.id,
  };

  if (def.selection) {
    action.selection = def.selection as "selected" | "query";
  }

  if (def.allowedWhen) {
    action.allowedWhen = def.allowedWhen;
  }

  if (def.confirm) {
    action.confirm = def.confirm;
  }

  if (def.ui && Object.keys(def.ui).length > 0) {
    action.ui = def.ui;
  }

  if (def.dialogModel) {
    action.dialog = {
      title: def.dialog?.title,
      description: def.dialog?.description,
      fields: buildDialogFields(program, def.dialogModel),
    };
  }

  if (def.api) {
    action.api = {
      path: def.api.path,
      method: (def.api.method as string) ?? "POST",
      params: def.api.params,
      body: def.api.body,
      query: def.api.query,
    };
  }

  return action;
}

function buildDialogFields(program: Program, model: Model): DialogField[] {
  const fields: DialogField[] = [];

  for (const [, prop] of model.properties) {
    const field: DialogField = {
      name: prop.name,
    };

    const label = getLabel(program, prop);
    if (label) {
      field.label = label;
    }

    const kind = getKind(program, prop);
    if (kind) {
      field.kind = kind;
    }

    // Build validation for dialog field
    const validation = buildDialogFieldValidation(program, prop);
    if (validation && Object.keys(validation).length > 0) {
      field.validation = validation;
    }

    fields.push(field);
  }

  return fields;
}

function buildDialogFieldValidation(
  program: Program,
  prop: ModelProperty,
): DialogField["validation"] {
  const validation: NonNullable<DialogField["validation"]> = {};

  const required = isRequired(program, prop);
  if (required) {
    validation.required = true;
  }

  const minLength =
    getMinLength(program, prop) ?? getMinLengthStd(program, prop);
  if (minLength !== undefined) {
    validation.minLength = minLength;
  }

  const maxLength =
    getMaxLength(program, prop) ?? getMaxLengthStd(program, prop);
  if (maxLength !== undefined) {
    validation.maxLength = maxLength;
  }

  const min = getMin(program, prop);
  if (min !== undefined) {
    validation.min = min;
  }

  const max = getMax(program, prop);
  if (max !== undefined) {
    validation.max = max;
  }

  const pattern = getPattern(program, prop) ?? getPatternStd(program, prop);
  if (pattern !== undefined) {
    validation.pattern = pattern;
  }

  const match = getMatch(program, prop);
  if (match !== undefined) {
    validation.match = match;
  }

  return validation;
}

function getTypeString(prop: ModelProperty): string {
  const type = prop.type;

  switch (type.kind) {
    case "Scalar":
      return mapScalarType(type.name);
    case "Model":
      // Check if it's an array
      if (type.name === "Array" && type.templateMapper?.args) {
        const elementType = type.templateMapper.args[0];
        if (elementType && elementType.entityKind === "Type") {
          // Handle Model element type (e.g., Tag[])
          if (elementType.kind === "Model") {
            return `${elementType.name}[]`;
          }
          // Handle Scalar element type (e.g., string[])
          if (elementType.kind === "Scalar") {
            return `${mapScalarType(elementType.name)}[]`;
          }
          // Handle Enum element type (e.g., Status[])
          if (elementType.kind === "Enum") {
            return "string[]";
          }
        }
        // Fallback for unknown array element type
        return "unknown[]";
      }
      return type.name;
    case "Enum":
      return "string";
    case "Union":
      return "string"; // Simplify unions to string for now
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
