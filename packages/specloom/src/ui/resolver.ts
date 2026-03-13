import type { CompiledResource } from "@specloom/spec";
import { createUiConfig } from "./config.js";
import type {
  ActionPresentationPatch,
  ColumnPresentationPatch,
  PresentationPatch,
  ResolveActionPresentationInput,
  ResolveColumnPresentationInput,
  ResolveFieldPresentationInput,
  ResolveSectionPresentationInput,
  ResolvedActionPresentation,
  ResolvedColumnPresentation,
  ResolvedFieldPresentation,
  ResolvedSectionPresentation,
  ResourceUiConfig,
  SectionPresentationPatch,
  UiConfig,
  ViewKind,
  ViewUiConfig,
} from "./types.js";

export interface UiResolver {
  field(input: ResolveFieldPresentationInput): ResolvedFieldPresentation;
  action(input: ResolveActionPresentationInput): ResolvedActionPresentation;
  section(input: ResolveSectionPresentationInput): ResolvedSectionPresentation;
  column(input: ResolveColumnPresentationInput): ResolvedColumnPresentation;
}

export function createUiResolver(ui?: UiConfig): UiResolver {
  const config = createUiConfig(ui);

  return {
    field(input) {
      return resolveFieldPresentation({ ...input, ui: config });
    },
    action(input) {
      return resolveActionPresentation({ ...input, ui: config });
    },
    section(input) {
      return resolveSectionPresentation({ ...input, ui: config });
    },
    column(input) {
      return resolveColumnPresentation({ ...input, ui: config });
    },
  };
}

export function resolveFieldPresentation(
  input: ResolveFieldPresentationInput,
): ResolvedFieldPresentation {
  const ui = createUiConfig(input.ui);
  const resourceConfig = getResourceUiConfig(ui, input.resource);
  const viewConfig = getViewUiConfig(resourceConfig, input.view);
  const resourcePatch = resourceConfig?.fields?.[input.field.name];
  const viewPatch = viewConfig?.fields?.[input.field.name];
  const patch = mergePresentationPatch(resourcePatch, viewPatch);

  const widgetRenderer = input.field.ui.widget;
  const globalRenderer = getGlobalFieldRenderer(ui, input.field);
  const semanticRenderer = getSemanticFieldRenderer(input.field);

  const renderer =
    viewPatch?.renderer ??
    resourcePatch?.renderer ??
    widgetRenderer ??
    globalRenderer ??
    semanticRenderer;

  return {
    renderer,
    label: input.field.label,
    appearance: patch.appearance ?? input.field.ui.appearance,
    state: {
      visible: input.field.visible,
      required: "required" in input.field ? input.field.required : false,
      readonly: "readonly" in input.field ? input.field.readonly : false,
      disabled: "disabled" in input.field ? input.field.disabled : false,
      invalid: "errors" in input.field ? input.field.errors.length > 0 : false,
    },
    hints: {
      placeholder: input.field.ui.placeholder,
      help: input.field.ui.help,
      emptyText: input.field.ui.emptyText,
      format: input.field.ui.format,
    },
    layout: {
      section: input.field.ui.section,
      order: input.field.ui.order,
      placement:
        patch.layout?.placement ?? input.field.ui.placement?.[input.view],
      span: patch.layout?.span,
    },
    data: {
      fieldType: input.field.type.kind,
      options: input.field.options,
      optionsSource: input.field.optionsSource,
      relation: input.field.relation,
      nested: input.field.nested,
      submit: input.field.submit,
    },
    props: patch.props ?? {},
    client: {
      ...input.resource.meta.client,
      ...resourceConfig?.client,
      ...viewConfig?.client,
      ...input.field.ui.client,
      ...input.field.relation?.client,
      ...patch.client,
    },
    source: {
      renderer: viewPatch?.renderer
        ? "view-config"
        : resourcePatch?.renderer
          ? "resource-config"
          : widgetRenderer
            ? "field-ui.widget"
            : globalRenderer
              ? "global-default"
              : "semantic-default",
    },
  };
}

export function resolveActionPresentation(
  input: ResolveActionPresentationInput,
): ResolvedActionPresentation {
  const ui = createUiConfig(input.ui);
  const resourceConfig = getResourceUiConfig(ui, input.resource);
  const viewConfig = getViewUiConfig(resourceConfig, input.view);
  const resourcePatch = resourceConfig?.actions?.[input.action.id];
  const viewPatch = viewConfig?.actions?.[input.action.id];
  const patch = mergeActionPatch(resourcePatch, viewPatch);

  return {
    renderer:
      viewPatch?.renderer ??
      resourcePatch?.renderer ??
      getGlobalActionRenderer(ui, input.action, input.view) ??
      getSemanticActionRenderer(input.action, input.view),
    label: input.action.label,
    icon: input.action.icon,
    prominence: input.action.prominence,
    disabled: input.action.disabled,
    hidden: !input.action.visible,
    confirm: patch.confirm ?? input.action.confirm,
    props: patch.props ?? {},
    client: {
      ...input.resource.meta.client,
      ...resourceConfig?.client,
      ...viewConfig?.client,
      ...input.action.client,
      ...patch.client,
    },
  };
}

export function resolveSectionPresentation(
  input: ResolveSectionPresentationInput,
): ResolvedSectionPresentation {
  const ui = createUiConfig(input.ui);
  const resourceConfig = getResourceUiConfig(ui, input.resource);
  const viewConfig = getViewUiConfig(resourceConfig, input.view);
  const resourcePatch = resourceConfig?.sections?.[input.section.id];
  const viewPatch = viewConfig?.sections?.[input.section.id];
  const patch = mergeSectionPatch(resourcePatch, viewPatch);

  return {
    renderer:
      viewPatch?.renderer ??
      resourcePatch?.renderer ??
      ui.defaults?.sectionRenderer ??
      "record-section",
    label: input.section.label,
    collapsible: input.section.collapsible,
    defaultCollapsed: input.section.defaultCollapsed,
    layout: {
      placement: patch.layout?.placement ?? input.section.placement,
      columns: patch.layout?.columns,
    },
    props: patch.props ?? {},
    client: {
      ...input.resource.meta.client,
      ...resourceConfig?.client,
      ...viewConfig?.client,
      ...patch.client,
    },
  };
}

export function resolveColumnPresentation(
  input: ResolveColumnPresentationInput,
): ResolvedColumnPresentation {
  const ui = createUiConfig(input.ui);
  const resourceConfig = getResourceUiConfig(ui, input.resource);
  const viewConfig = getViewUiConfig(resourceConfig, "list");
  const resourcePatch = resourceConfig?.columns?.[input.field.name];
  const viewPatch = viewConfig?.columns?.[input.field.name];
  const patch = mergeColumnPatch(resourcePatch, viewPatch);

  return {
    renderer:
      viewPatch?.renderer ??
      resourcePatch?.renderer ??
      ui.defaults?.columnRenderer ??
      (input.field.template ? "template-column" : "text-column"),
    label: input.field.label,
    sortable: input.field.sortable,
    placement: patch.placement ?? input.field.placement,
    props: patch.props ?? {},
    client: {
      ...input.resource.meta.client,
      ...resourceConfig?.client,
      ...viewConfig?.client,
      ...input.field.ui.client,
      ...patch.client,
    },
  };
}

function getResourceUiConfig(
  ui: UiConfig,
  resource: CompiledResource,
): ResourceUiConfig | undefined {
  return ui.resources?.[resource.name];
}

function getViewUiConfig(
  resourceConfig: ResourceUiConfig | undefined,
  view: ViewKind,
): ViewUiConfig | undefined {
  return resourceConfig?.views?.[view];
}

function mergePresentationPatch(
  base?: PresentationPatch,
  override?: PresentationPatch,
): PresentationPatch {
  return {
    renderer: override?.renderer ?? base?.renderer,
    appearance: override?.appearance ?? base?.appearance,
    props: {
      ...base?.props,
      ...override?.props,
    },
    client: {
      ...base?.client,
      ...override?.client,
    },
    layout: {
      ...base?.layout,
      ...override?.layout,
    },
  };
}

function mergeActionPatch(
  base?: ActionPresentationPatch,
  override?: ActionPresentationPatch,
): ActionPresentationPatch {
  return {
    ...mergePresentationPatch(base, override),
    confirm: override?.confirm ?? base?.confirm,
  };
}

function mergeSectionPatch(
  base?: SectionPresentationPatch,
  override?: SectionPresentationPatch,
): SectionPresentationPatch {
  return {
    renderer: override?.renderer ?? base?.renderer,
    props: {
      ...base?.props,
      ...override?.props,
    },
    client: {
      ...base?.client,
      ...override?.client,
    },
    layout: {
      ...base?.layout,
      ...override?.layout,
    },
  };
}

function mergeColumnPatch(
  base?: ColumnPresentationPatch,
  override?: ColumnPresentationPatch,
): ColumnPresentationPatch {
  return {
    renderer: override?.renderer ?? base?.renderer,
    props: {
      ...base?.props,
      ...override?.props,
    },
    client: {
      ...base?.client,
      ...override?.client,
    },
    placement: override?.placement ?? base?.placement,
  };
}

function getGlobalFieldRenderer(
  ui: UiConfig,
  field: ResolveFieldPresentationInput["field"],
): string | undefined {
  const renderers = ui.defaults?.fieldRenderers;
  if (!renderers) {
    return undefined;
  }

  const keys = getFieldRendererKeys(field);
  for (const key of keys) {
    const renderer = renderers[key];
    if (renderer) {
      return renderer;
    }
  }

  return undefined;
}

function getFieldRendererKeys(
  field: ResolveFieldPresentationInput["field"],
): string[] {
  if (field.nested) {
    return field.nested.widget
      ? [`nested:${field.nested.widget}`, "nested", field.type.kind]
      : ["nested", field.type.kind];
  }

  if (field.relation) {
    return [
      `relation:${field.relation.cardinality}`,
      "relation",
      field.type.kind,
    ];
  }

  if (field.type.kind === "enum") {
    return field.type.array ? ["enum:array", "enum"] : ["enum"];
  }

  if (field.type.kind === "scalar") {
    if (field.type.array) {
      return ["scalar:array", "scalar"];
    }
    return field.type.name
      ? [`scalar:${field.type.name}`, "scalar"]
      : ["scalar"];
  }

  return [field.type.kind];
}

function getSemanticFieldRenderer(
  field: ResolveFieldPresentationInput["field"],
): string {
  if (field.nested) {
    switch (field.nested.widget) {
      case "cards":
        return "nested-cards";
      case "inline-form":
        return "nested-inline-form";
      default:
        return "nested-table";
    }
  }

  if (field.relation) {
    return field.relation.cardinality === "many"
      ? "relation-multi-picker"
      : "relation-picker";
  }

  if (field.type.kind === "enum") {
    return field.type.array ? "multi-select" : "select";
  }

  if (field.type.kind === "scalar") {
    if (field.type.array) {
      return "array-input";
    }
    if (field.type.name === "boolean") {
      return "switch";
    }
  }

  return "text-input";
}

function getGlobalActionRenderer(
  ui: UiConfig,
  action: ResolveActionPresentationInput["action"],
  view: ViewKind,
): string | undefined {
  const renderers = ui.defaults?.actionRenderers;
  if (!renderers) {
    return undefined;
  }

  const keys = [
    `${view}:${action.kind}`,
    action.selection !== "none" ? `${view}:selection` : undefined,
    action.kind,
  ].filter((key): key is string => key !== undefined);

  for (const key of keys) {
    const renderer = renderers[key];
    if (renderer) {
      return renderer;
    }
  }

  return undefined;
}

function getSemanticActionRenderer(
  action: ResolveActionPresentationInput["action"],
  view: ViewKind,
): string {
  if (view === "list" && action.selection !== "none") {
    return "bulk-action-button";
  }

  return action.kind === "row" ? "row-action-button" : "page-action-button";
}
