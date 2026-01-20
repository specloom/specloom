// ============================================================
// Definition Spec Types (v0.1)
// ============================================================

/**
 * Spec 全体の構造
 */
export interface Spec {
  version: "0.1";
  resources: Resource[];
  views: View[];
}

// ============================================================
// Resource
// ============================================================

export interface Resource {
  name: string;
  label?: string;
  fields: Field[];
  validation?: ResourceValidation;
}

export interface ResourceValidation {
  requiredOneOf?: string[][];
}

// ============================================================
// Field
// ============================================================

export type FieldType =
  | "string"
  | "int32"
  | "float64"
  | "boolean"
  | "date"
  | "datetime"
  | string; // Model or Model[] for relations

export type FieldKind =
  | "text"
  | "longText"
  | "email"
  | "password"
  | "url"
  | "tel"
  | "number"
  | "currency"
  | "percent"
  | "boolean"
  | "date"
  | "datetime"
  | "time"
  | "enum"
  | "status"
  | "relation"
  | "file"
  | "image"
  | "json"
  | string;

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  kind?: FieldKind;
  required?: boolean;
  readonly?: boolean;
  validation?: FieldValidation;
  options?: Option[];
  relation?: Relation;
  ui?: FieldUI;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  minItems?: number;
  maxItems?: number;
}

export interface Option {
  value: string;
  label: string;
}

export interface Relation {
  resource: string;
  labelField: string;
}

export interface FieldUI {
  hint?: string;
  inputHint?: string;
  searchable?: boolean;
}

// ============================================================
// View
// ============================================================

export type ViewType = "list" | "form" | "show";

export type View = ListView | FormView | ShowView;

// ============================================================
// List View
// ============================================================

export interface ListView {
  resource: string;
  type: "list";
  columns: string[];
  searchable?: string[];
  sortable?: string[];
  defaultSort?: Sort;
  selection?: "none" | "single" | "multi";
  clickAction?: string;
  namedFilters?: NamedFilter[];
  actions: Action[];
}

export interface Sort {
  field: string;
  order: "asc" | "desc";
}

export interface NamedFilter {
  id: string;
  label: string;
  filter: FilterExpression | Record<string, unknown>;
}

// ============================================================
// Filter Expression (Advanced Query)
// ============================================================

/**
 * フィルター式（AND/OR/NOT と条件の組み合わせ）
 */
export type FilterExpression =
  | FilterCondition
  | AndExpression
  | OrExpression
  | NotExpression;

/**
 * AND 結合
 */
export interface AndExpression {
  and: FilterExpression[];
}

/**
 * OR 結合
 */
export interface OrExpression {
  or: FilterExpression[];
}

/**
 * NOT（否定）
 */
export interface NotExpression {
  not: FilterExpression;
}

/**
 * 単一フィルター条件
 */
export interface FilterCondition {
  /** フィールドパス（例: "status", "author.name"） */
  field: string;
  /** 演算子 */
  op: FilterOperator;
  /** 比較値 */
  value: unknown;
}

/**
 * フィルター演算子
 */
export type FilterOperator =
  // 比較
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  // 文字列
  | "contains"
  | "startsWith"
  | "endsWith"
  | "matches"
  | "ilike"
  // 集合
  | "in"
  | "notIn"
  // 存在
  | "isNull"
  | "isEmpty"
  // 配列
  | "hasAny"
  | "hasAll"
  | "hasNone";

// ============================================================
// Form View
// ============================================================

export interface FormView {
  resource: string;
  type: "form";
  fields: string[];
  actions: Action[];
}

// ============================================================
// Show View
// ============================================================

export interface ShowView {
  resource: string;
  type: "show";
  fields: string[];
  actions: Action[];
}

// ============================================================
// Action
// ============================================================

export type ActionPlacement = "header" | "row" | "bulk";

export interface Action {
  id: string;
  label: string;
  placement: ActionPlacement;
  allowedWhen?: string;
  confirm?: string;
  ui?: ActionUI;
}

export interface ActionUI {
  icon?: string;
  variant?: string;
}
