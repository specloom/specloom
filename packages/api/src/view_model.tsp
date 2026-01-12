// ============================================================
// ViewModel Types
// ============================================================

import "./common.tsp";

namespace SpecloomApi;

model ActionVM {
  id: string;
  label: string;
  allowed: boolean;
  confirm?: string;
  ui?: ActionUI;
}

model RowVM {
  id: string;
  values: Record<unknown>;
  actions: ActionVM[];
}

model ListFieldVM {
  name: string;
  label: string;
  kind: string;
  sortable?: boolean;
  ui?: FieldUI;
  options?: Option[];
}

model NamedFilter {
  id: string;
  label: string;
  active: boolean;
}

model Filters {
  named: NamedFilter[];
}

model Selection {
  mode: "single" | "multi" | "none";
  selected: string[];
}

model Search {
  fields: string[];
  query: string;
}

model ListViewModel {
  type: "list";
  resource: string;
  label: string;
  fields: ListFieldVM[];
  header_actions: ActionVM[];
  rows: RowVM[];
  filters: Filters;
  selection: Selection;
  search: Search;
}

model ShowFieldVM {
  name: string;
  label: string;
  kind: string;
  value: unknown;
  ui?: FieldUI;
  options?: Option[];
}

model ShowViewModel {
  type: "show";
  resource: string;
  label: string;
  id: string;
  fields: ShowFieldVM[];
  actions: ActionVM[];
}

model FormFieldVM {
  name: string;
  label: string;
  kind: string;
  value: unknown;
  required: boolean;
  readonly: boolean;
  validation?: Validation;
  errors: string[];
  ui?: FieldUI;
  options?: Option[];
}

model FormViewModel {
  type: "form";
  resource: string;
  label: string;
  mode: "create" | "edit";
  id?: string;
  fields: FormFieldVM[];
  actions: ActionVM[];
  is_valid: boolean;
  is_dirty: boolean;
}
