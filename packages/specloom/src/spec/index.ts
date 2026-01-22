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
  rowActions: Action[];
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
  operator: FilterOperator;
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
  | "starts_with"
  | "ends_with"
  | "matches"
  | "ilike"
  // 集合
  | "in"
  | "not_in"
  // 存在
  | "is_null"
  | "is_empty"
  // 配列
  | "has_any"
  | "has_all"
  | "has_none";

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

/**
 * 選択要件
 * - false/undefined: 選択不要（新規作成など）
 * - true/"selection": 選択した行が対象
 * - "query": 現在のフィルター条件に合う全件が対象
 */
export type SelectionRequirement = boolean | "selection" | "query";

export interface Action {
  id: string;
  label: string;
  allowedWhen?: string;
  /** headerActions のみ有効。選択行またはクエリ全体を対象とするか */
  requiresSelection?: SelectionRequirement;
  confirm?: string;
  ui?: ActionUI;
}

export interface ActionUI {
  icon?: string;
  variant?: string;
}
