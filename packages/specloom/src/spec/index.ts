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
  | "nested"
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
  createOnly?: boolean;
  validation?: FieldValidation;
  options?: Option[];
  /** フィルター可能設定。true=全演算子許可、配列=許可演算子 */
  filter?: true | FilterOperator[];
  relation?: Relation;
  nested?: Nested;
  ui?: FieldUI;
  /** 条件付き表示（式が true の場合のみ表示） */
  visibleWhen?: string;
  /** 条件付き必須（式が true の場合に必須化） */
  requiredWhen?: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  match?: string;
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
  valueField?: string;
  searchable?: boolean;
  cardinality?: "one" | "many";
}

export interface Nested {
  resource: string;
  min?: number;
  max?: number;
}

export interface FieldUI {
  hint?: string;
  inputHint?: string;
  searchable?: boolean;
  icon?: string;
  variant?: string;
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
  selectionMode?: "none" | "single" | "multi";
  clickAction?: string;
  namedFilters?: NamedFilter[];
  actions: Action[];
  rowActions?: Action[];
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
  | "startsWith" // legacy alias
  | "ends_with"
  | "endsWith" // legacy alias
  | "matches"
  | "ilike"
  // 集合
  | "in"
  | "not_in"
  | "notIn" // legacy alias
  // 存在
  | "is_null"
  | "isNull" // legacy alias
  | "is_empty"
  | "isEmpty" // legacy alias
  // 配列
  | "has_any"
  | "hasAny" // legacy alias
  | "has_all"
  | "hasAll" // legacy alias
  | "has_none"
  | "hasNone"; // legacy alias

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
 * アクションの対象選択
 * - undefined: 選択不要（ページアクション）
 * - "selected": 選択した行が対象（バルクアクション）
 * - "query": 現在のフィルター条件に合う全件が対象（バルクアクション）
 */
export type ActionSelection = "selected" | "query";

export interface Action {
  id: string;
  label: string;
  allowedWhen?: string;
  /** バルクアクションの対象。省略時はページアクション */
  selection?: ActionSelection;
  /** true の場合はロケール既定メッセージで確認する */
  confirm?: string | true;
  ui?: ActionUI;
  /** ダイアログ設定 */
  dialog?: ActionDialog;
  /** API エンドポイント設定 */
  api?: ActionApi;
}

export interface ActionDialog {
  title?: string;
  description?: string;
  fields: DialogField[];
}

export interface DialogField {
  name: string;
  label?: string;
  kind?: string;
  validation?: FieldValidation;
}

export interface ActionApi {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, string>;
  body?: string[];
  query?: Record<string, string>;
}

export interface ActionUI {
  icon?: string;
  variant?: string;
}
