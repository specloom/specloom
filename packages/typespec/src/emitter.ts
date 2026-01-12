import {
  emitFile,
  resolvePath,
  navigateProgram,
  type EmitContext,
  type Model,
  type ModelProperty,
  type Program,
} from "@typespec/compiler";
import type { SpecloomEmitterOptions } from "./lib.js";
import {
  getResourceName,
  getLabel,
  getKind,
  getOptions,
  getRelation,
  getUI,
  isReadonly,
  isComputed,
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
  getAction,
  getPlacement,
  getAllowedWhen,
  getConfirm,
  getMinLength,
  getMaxLength,
  getMin,
  getMax,
  getPattern,
  getMinItems,
  getMaxItems,
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
}

interface Field {
  name: string;
  type: string;
  label?: string;
  kind?: string;
  required?: boolean;
  readonly?: boolean;
  computed?: boolean;
  options?: { value: string; label: string }[];
  relation?: { resource: string; labelField?: string };
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
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
  selection?: string;
  namedFilters?: { id: string; label: string; filter: unknown }[];
  actions: Action[];
}

interface Action {
  id: string;
  label: string;
  placement: string;
  allowedWhen?: string;
  confirm?: string;
  ui?: Record<string, unknown>;
}

export async function $onEmit(context: EmitContext<SpecloomEmitterOptions>) {
  if (context.program.compilerOptions.noEmit) {
    return;
  }

  const spec = buildSpec(context.program);
  const outputFile = context.options["output-file"] ?? "spec.json";

  await emitFile(context.program, {
    path: resolvePath(context.emitterOutputDir, outputFile),
    content: JSON.stringify(spec, null, 2) + "\n",
  });
}

function buildSpec(program: Program): Spec {
  const resources: Resource[] = [];
  const views: View[] = [];
  const resourceModels: Model[] = [];
  const viewModels: Model[] = [];

  // First pass: collect resources and views
  navigateProgram(program, {
    model(model) {
      const resourceName = getResourceName(program, model);
      if (resourceName) {
        resourceModels.push(model);
      }

      const viewInfo = getView(program, model);
      if (viewInfo) {
        viewModels.push(model);
      }
    },
  });

  // Build resources
  for (const model of resourceModels) {
    resources.push(buildResource(program, model));
  }

  // Build views
  for (const model of viewModels) {
    views.push(buildView(program, model));
  }

  return {
    version: "0.1",
    resources,
    views,
  };
}

function buildResource(program: Program, model: Model): Resource {
  const resourceName = getResourceName(program, model)!;
  const label = getLabel(program, model);
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

  // Manual options override auto-generated enum options
  const options = getOptions(program, prop);
  if (options) {
    field.options = options;
  }

  const relation = getRelation(program, prop);
  if (relation) {
    field.relation = relation;
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

  const minLength = getMinLength(program, prop);
  if (minLength !== undefined) {
    validation.minLength = minLength;
  }

  const maxLength = getMaxLength(program, prop);
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

  const pattern = getPattern(program, prop);
  if (pattern !== undefined) {
    validation.pattern = pattern;
  }

  const minItems = getMinItems(program, prop);
  if (minItems !== undefined) {
    validation.minItems = minItems;
  }

  const maxItems = getMaxItems(program, prop);
  if (maxItems !== undefined) {
    validation.maxItems = maxItems;
  }

  return validation;
}

function buildView(program: Program, model: Model): View {
  const viewInfo = getView(program, model)!;
  const actions: Action[] = [];

  // Collect actions from model properties
  for (const [, prop] of model.properties) {
    const actionId = getAction(program, prop);
    if (actionId) {
      actions.push(buildAction(program, prop, actionId));
    }
  }

  const view: View = {
    resource: viewInfo.resource,
    type: viewInfo.type as View["type"],
    actions,
  };

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

    const selection = getSelection(program, model);
    if (selection) {
      view.selection = selection;
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

function buildAction(
  program: Program,
  prop: ModelProperty,
  actionId: string,
): Action {
  const label = getLabel(program, prop);
  const placement = getPlacement(program, prop);
  const allowedWhen = getAllowedWhen(program, prop);
  const confirm = getConfirm(program, prop);
  const ui = getUI(program, prop);

  const action: Action = {
    id: actionId,
    label: label ?? actionId,
    placement: placement ?? "header",
  };

  if (allowedWhen) {
    action.allowedWhen = allowedWhen;
  }

  if (confirm) {
    action.confirm = confirm;
  }

  if (ui && Object.keys(ui).length > 0) {
    action.ui = ui;
  }

  return action;
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
        if (
          elementType &&
          elementType.entityKind === "Type" &&
          elementType.kind === "Model"
        ) {
          return `${elementType.name}[]`;
        }
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
