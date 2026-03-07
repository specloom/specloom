import type {
  CompiledAction,
  CompiledColumn,
  CompiledField,
  CompiledFieldSubmit,
  CompiledFieldType,
  CompiledFieldUi,
  CompiledFieldValidation,
  CompiledNamedFilter,
  CompiledNested,
  CompiledOption,
  CompiledOptionSource,
  CompiledRelation,
  CompiledSection,
} from "@specloom/spec";

export interface Context {
  user?: Record<string, unknown>;
  role?: string;
  permissions?: string[];
  custom?: Record<string, unknown>;
}

export interface ValidationErrors {
  [fieldName: string]: string[];
}

export interface ActionVM {
  id: string;
  kind: CompiledAction["kind"];
  view: CompiledAction["view"];
  resource: string;
  label: string;
  visible: boolean;
  disabled: boolean;
  allowed: boolean;
  selection: "none" | "selected" | "query";
  placement?: string;
  order?: number;
  icon?: string;
  prominence?: CompiledAction["prominence"];
  confirmMessage?: string;
  args?: Record<string, unknown>;
  input?: string;
  operation: CompiledAction["operation"];
  client?: Record<string, unknown>;
}

export interface ListColumnVM extends CompiledColumn {
  fieldSpec: CompiledField;
}

export interface NamedFilterVM extends CompiledNamedFilter {
  active: boolean;
}

export interface ListRowVM {
  id: string;
  record: Record<string, unknown>;
  values: Record<string, unknown>;
  actions: ActionVM[];
}

export interface ListViewModel {
  type: "list";
  resource: string;
  label: string;
  columns: ListColumnVM[];
  rows: ListRowVM[];
  namedFilters: NamedFilterVM[];
  search: {
    fields: string[];
    query: string;
  };
  selection: {
    mode: "none" | "single" | "multi";
    selected: string[];
  };
  pageActions: ActionVM[];
  selectionActions: ActionVM[];
  defaultSort?: {
    field: string;
    direction: "asc" | "desc";
  };
  clickAction: "none" | "show" | "edit";
}

interface BaseFieldVM {
  name: string;
  label: string;
  type: CompiledFieldType;
  value: unknown;
  visible: boolean;
  hidden: boolean;
  ui: CompiledFieldUi;
  validation?: CompiledFieldValidation;
  options?: CompiledOption[];
  optionsSource?: CompiledOptionSource;
  relation?: CompiledRelation;
  nested?: CompiledNested;
  submit: CompiledFieldSubmit;
}

export interface ShowFieldVM extends BaseFieldVM {}

export interface FormFieldVM extends BaseFieldVM {
  required: boolean;
  readonly: boolean;
  disabled: boolean;
  errors: string[];
}

export interface RecordSectionVM<TField> {
  id: string;
  label: string;
  placement?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: TField[];
  source: CompiledSection;
}

export interface ShowViewModel {
  type: "show";
  resource: string;
  label: string;
  id: string;
  fields: ShowFieldVM[];
  sections: RecordSectionVM<ShowFieldVM>[];
  actions: ActionVM[];
}

export interface FormViewModel {
  type: "form";
  resource: string;
  label: string;
  mode: "create" | "edit";
  id?: string;
  fields: FormFieldVM[];
  sections: RecordSectionVM<FormFieldVM>[];
  actions: ActionVM[];
  isValid: boolean;
  isDirty: boolean;
}

export type ViewModel = ListViewModel | ShowViewModel | FormViewModel;
