// ============================================================
// ViewModel Types
// ============================================================

import type {
  FieldKind,
  FieldUI,
  ActionUI,
  Option,
  FieldValidation,
} from "../spec/index.js";

// Re-export shared types
export type { FieldUI, ActionUI, Option, FieldValidation };

/**
 * 評価コンテキスト
 */
export interface Context {
  user: Record<string, unknown>;
  role: string;
  permissions: string[];
  custom: Record<string, unknown>;
}

// ============================================================
// ViewModel Union Type
// ============================================================

export type ViewModel = ListViewModel | ShowViewModel | FormViewModel;

// ============================================================
// List ViewModel
// ============================================================

export interface ListViewModel {
  type: "list";
  resource: string;
  label: string;
  fields: ListFieldVM[];
  headerActions: ActionVM[];
  rows: RowVM[];
  filters: Filters;
  selection: Selection;
  search: Search;
}

export interface ListFieldVM {
  name: string;
  label: string;
  kind: FieldKind;
  sortable?: boolean;
  ui?: FieldUI;
  options?: Option[];
}

export interface RowVM {
  id: string;
  values: Record<string, unknown>;
  actions: ActionVM[];
}

export interface Filters {
  named: NamedFilterVM[];
}

export interface NamedFilterVM {
  id: string;
  label: string;
  active: boolean;
}

export interface Selection {
  mode: "none" | "single" | "multi";
  selected: string[];
}

export interface Search {
  fields: string[];
  query: string;
}

// ============================================================
// Show ViewModel
// ============================================================

export interface ShowViewModel {
  type: "show";
  resource: string;
  label: string;
  id: string;
  fields: ShowFieldVM[];
  actions: ActionVM[];
}

export interface ShowFieldVM {
  name: string;
  label: string;
  kind: FieldKind;
  value: unknown;
  ui?: FieldUI;
  options?: Option[];
}

// ============================================================
// Form ViewModel
// ============================================================

export interface FormViewModel {
  type: "form";
  resource: string;
  label: string;
  mode: "create" | "edit";
  id?: string;
  fields: FormFieldVM[];
  actions: ActionVM[];
  isValid: boolean;
  isDirty: boolean;
}

export interface FormFieldVM {
  name: string;
  label: string;
  kind: FieldKind;
  value: unknown;
  required: boolean;
  readonly: boolean;
  validation?: FieldValidation;
  errors: string[];
  ui?: FieldUI;
  options?: Option[];
}

// ============================================================
// Action ViewModel
// ============================================================

/**
 * 評価済みアクション
 * - allowedWhen は評価されて allowed: boolean になる
 */
export interface ActionVM {
  id: string;
  label: string;
  /** 評価済みの許可状態 */
  allowed: boolean;
  confirm?: string;
  ui?: ActionUI;
}
