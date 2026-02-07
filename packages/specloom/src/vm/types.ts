// ============================================================
// ViewModel Types
// ============================================================

import type {
  FieldKind,
  FieldUI,
  ActionUI,
  ActionDialog,
  ActionApi,
  Option,
  FieldValidation,
  FilterExpression,
  Relation,
} from "../spec/index.js";

// Re-export shared types
export type { FieldUI, ActionUI, Option, FieldValidation, FilterExpression };

/**
 * 評価コンテキスト
 */
export interface Context {
  user?: Record<string, unknown>;
  role?: string;
  permissions?: string[];
  custom?: Record<string, unknown>;
}

// ============================================================
// ViewModel Union Type
// ============================================================

export type ViewModel = ListViewModel | ShowViewModel | FormViewModel;

// ============================================================
// List ViewModel (Plain data, serializable)
// ============================================================

export interface ListViewModel {
  type: "list";
  resource: string;
  label: string;
  fields: ListFieldVM[];
  pageActions: ActionVM[];
  bulkActions: ActionVM[];
  rows: RowVM[];
  filters: Filters;
  selection: Selection;
  search: Search;
  /** spec定義のデフォルトソート */
  defaultSort?: SortVM;
  /** ユーザーが適用中のソート（複数カラム対応） */
  sorts?: SortVM[];
  clickAction?: string;
  pagination?: Pagination;
  isLoading?: boolean;
  error?: string;
  /** 行ごとのローディング状態 */
  rowsLoading?: string[];
  /** 行ごとのエラー */
  rowErrors?: Record<string, string[]>;
  /** 実行中のバルクアクションID */
  bulkActionInProgress?: string;
  /** バルクアクションの進捗 */
  bulkActionProgress?: BulkActionProgress;
}

export interface BulkActionProgress {
  total: number;
  completed: number;
  failed: number;
  /** 行ごとのステータス */
  rowStatus?: Record<string, "pending" | "success" | "failed" | "skipped">;
  /** 行ごとのエラーメッセージ */
  rowErrors?: Record<string, string>;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface SortVM {
  field: string;
  order: "asc" | "desc";
}

export interface ListFieldVM {
  name: string;
  label: string;
  kind: FieldKind;
  sortable?: boolean;
  ui?: FieldUI;
  options?: Option[];
  relation?: Relation;
}

export interface RowVM {
  id: string;
  values: Record<string, unknown>;
  actions: ActionVM[];
  /** 行のローディング状態 */
  isLoading?: boolean;
  /** 行のエラー */
  errors?: string[];
}

export interface Filters {
  named: NamedFilterVM[];
  custom?: FilterExpression;
}

export interface NamedFilterVM {
  id: string;
  label: string;
  active: boolean;
  filter?: FilterExpression;
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
// Show ViewModel (Plain data, serializable)
// ============================================================

export interface ShowViewModel {
  type: "show";
  resource: string;
  label: string;
  id: string;
  fields: ShowFieldVM[];
  actions: ActionVM[];
  // 追加
  groups?: FieldGroup[];
  isLoading?: boolean;
  error?: string;
}

export interface ShowFieldVM {
  name: string;
  label: string;
  kind: FieldKind;
  value: unknown;
  ui?: FieldUI;
  options?: Option[];
  relation?: Relation;
}

// ============================================================
// Form ViewModel (Plain data, serializable)
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
  // 追加
  groups?: FieldGroup[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  error?: string;
}

export interface FormFieldVM {
  name: string;
  label: string;
  kind: FieldKind;
  value: unknown;
  required: boolean;
  readonly: boolean;
  createOnly?: boolean;
  validation?: FieldValidation;
  errors: string[];
  ui?: FieldUI;
  options?: Option[];
  relation?: Relation;
  // 追加
  visible?: boolean;
  hint?: string;
  placeholder?: string;
}

export interface FieldGroup {
  id: string;
  label: string;
  fields: string[];
}

// ============================================================
// Action ViewModel
// ============================================================

export interface ActionVM {
  id: string;
  label: string;
  allowed: boolean;
  confirm?: string;
  ui?: ActionUI;
  dialog?: ActionDialog;
  api?: ActionApi;
}
