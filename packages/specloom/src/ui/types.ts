import type { CompiledResource } from "@specloom/spec";
import type {
  ActionVM,
  Context,
  FormFieldVM,
  ListColumnVM,
  RecordSectionVM,
  ShowFieldVM,
} from "../vm/types.js";

export type RendererKey = string;
export type ViewKind = "list" | "show" | "form";
export type PresentableFieldVM = FormFieldVM | ShowFieldVM;

export interface UiConfig {
  defaults?: {
    fieldRenderers?: Record<string, RendererKey>;
    actionRenderers?: Record<string, RendererKey>;
    sectionRenderer?: RendererKey;
    columnRenderer?: RendererKey;
  };
  resources?: Record<string, ResourceUiConfig>;
}

export interface ResourceUiConfig {
  client?: Record<string, unknown>;
  fields?: Record<string, PresentationPatch>;
  actions?: Record<string, ActionPresentationPatch>;
  sections?: Record<string, SectionPresentationPatch>;
  columns?: Record<string, ColumnPresentationPatch>;
  views?: Partial<Record<ViewKind, ViewUiConfig>>;
}

export interface ViewUiConfig {
  client?: Record<string, unknown>;
  fields?: Record<string, PresentationPatch>;
  actions?: Record<string, ActionPresentationPatch>;
  sections?: Record<string, SectionPresentationPatch>;
  columns?: Record<string, ColumnPresentationPatch>;
}

export interface PresentationPatch {
  renderer?: RendererKey;
  appearance?: string;
  props?: Record<string, unknown>;
  client?: Record<string, unknown>;
  layout?: {
    span?: number;
    placement?: string;
  };
}

export interface ActionPresentationPatch extends PresentationPatch {
  confirm?: ActionVM["confirm"];
}

export interface SectionPresentationPatch {
  renderer?: RendererKey;
  props?: Record<string, unknown>;
  client?: Record<string, unknown>;
  layout?: {
    columns?: number;
    placement?: string;
  };
}

export interface ColumnPresentationPatch {
  renderer?: RendererKey;
  props?: Record<string, unknown>;
  client?: Record<string, unknown>;
  placement?: string;
}

export interface ResolveFieldPresentationInput {
  resource: CompiledResource;
  field: PresentableFieldVM;
  view: "form" | "show";
  mode?: "create" | "edit";
  context?: Context;
  section?: RecordSectionVM<PresentableFieldVM>;
  ui?: UiConfig;
}

export interface ResolveActionPresentationInput {
  resource: CompiledResource;
  action: ActionVM;
  view: ViewKind;
  ui?: UiConfig;
}

export interface ResolveSectionPresentationInput<TField = PresentableFieldVM> {
  resource: CompiledResource;
  section: RecordSectionVM<TField>;
  view: "form" | "show";
  ui?: UiConfig;
}

export interface ResolveColumnPresentationInput {
  resource: CompiledResource;
  column: ListColumnVM;
  ui?: UiConfig;
}

export interface ResolvedFieldPresentation {
  renderer: RendererKey;
  label: string;
  appearance?: string;
  state: {
    visible: boolean;
    required: boolean;
    readonly: boolean;
    disabled: boolean;
    invalid: boolean;
  };
  hints: {
    placeholder?: string;
    help?: string;
    emptyText?: string;
    format?: string;
  };
  layout: {
    section?: string;
    order?: number;
    placement?: string;
    span?: number;
  };
  data: {
    fieldType: PresentableFieldVM["type"]["kind"];
    options?: PresentableFieldVM["options"];
    optionsSource?: PresentableFieldVM["optionsSource"];
    relation?: PresentableFieldVM["relation"];
    nested?: PresentableFieldVM["nested"];
    submit: PresentableFieldVM["submit"];
  };
  props: Record<string, unknown>;
  client: Record<string, unknown>;
  source: {
    renderer:
      | "resource-config"
      | "view-config"
      | "field-ui.widget"
      | "global-default"
      | "semantic-default";
  };
}

export interface ResolvedActionPresentation {
  renderer: RendererKey;
  label: string;
  icon?: string;
  prominence?: ActionVM["prominence"];
  disabled: boolean;
  hidden: boolean;
  confirm?: ActionVM["confirm"];
  props: Record<string, unknown>;
  client: Record<string, unknown>;
}

export interface ResolvedSectionPresentation {
  renderer: RendererKey;
  label: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  layout: {
    placement?: string;
    columns?: number;
  };
  props: Record<string, unknown>;
  client: Record<string, unknown>;
}

export interface ResolvedColumnPresentation {
  renderer: RendererKey;
  label: string;
  sortable: boolean;
  placement?: string;
  props: Record<string, unknown>;
  client: Record<string, unknown>;
}
