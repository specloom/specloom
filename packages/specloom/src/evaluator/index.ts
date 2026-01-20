import type {
  Spec,
  Resource,
  Field,
  View,
  ListView,
  ShowView,
  FormView,
  Action,
} from "../spec/index.js";
import type {
  Context,
  ViewModel,
  ListViewModel,
  ShowViewModel,
  FormViewModel,
  ListFieldVM,
  ShowFieldVM,
  FormFieldVM,
  RowVM,
  ActionVM,
  Filters,
  NamedFilterVM,
  Selection,
  Search,
  SortVM,
} from "../vm/index.js";
import { validateField, type ValidationErrors } from "../validation/index.js";

// ============================================================
// Main Evaluate Function
// ============================================================

export interface EvaluateListOptions {
  view: ListView;
  resource: Resource;
  context: Context;
  data: Record<string, unknown>[];
  activeFilter?: string;
  searchQuery?: string;
  selected?: string[];
}

export interface EvaluateShowOptions {
  view: ShowView;
  resource: Resource;
  context: Context;
  data: Record<string, unknown>;
}

export interface EvaluateFormOptions {
  view: FormView;
  resource: Resource;
  context: Context;
  data?: Record<string, unknown>;
  mode: "create" | "edit";
  errors?: ValidationErrors;
  isDirty?: boolean;
}

/**
 * ListView を評価して ListViewModel を生成
 */
export function evaluateListView(options: EvaluateListOptions): ListViewModel {
  const { view, resource, context, data, activeFilter, searchQuery, selected } =
    options;

  const fields = view.columns.map((colName) => {
    const field = resource.fields.find((f) => f.name === colName);
    if (!field) {
      throw new EvaluateError(`Field not found: ${colName}`);
    }
    return toListFieldVM(field, view);
  });

  const headerActions = view.actions
    .filter((a) => a.placement === "header")
    .map((a) => toActionVM(a, context, {}));

  const bulkActions = view.actions
    .filter((a) => a.placement === "bulk")
    .map((a) => toActionVM(a, context, {}));

  const rows = data.map((row) => toRowVM(row, view, resource, context));

  const filters = toFilters(view, activeFilter);
  const selection = toSelection(view, selected);
  const search = toSearch(view, searchQuery);
  const defaultSort = toDefaultSort(view);

  return {
    type: "list",
    resource: resource.name,
    label: resource.label ?? resource.name,
    fields,
    headerActions,
    bulkActions,
    rows,
    filters,
    selection,
    search,
    defaultSort,
    clickAction: view.clickAction,
  };
}

/**
 * ShowView を評価して ShowViewModel を生成
 */
export function evaluateShowView(options: EvaluateShowOptions): ShowViewModel {
  const { view, resource, context, data } = options;

  const id = String(data.id ?? "");

  const fields = view.fields.map((fieldName) => {
    const field = resource.fields.find((f) => f.name === fieldName);
    if (!field) {
      throw new EvaluateError(`Field not found: ${fieldName}`);
    }
    return toShowFieldVM(field, data[fieldName]);
  });

  const actions = view.actions.map((a) => toActionVM(a, context, data));

  return {
    type: "show",
    resource: resource.name,
    label: resource.label ?? resource.name,
    id,
    fields,
    actions,
  };
}

/**
 * FormView を評価して FormViewModel を生成
 */
export function evaluateFormView(options: EvaluateFormOptions): FormViewModel {
  const { view, resource, context, data, mode, errors, isDirty } = options;

  const id = data?.id != null ? String(data.id) : undefined;

  const fields = view.fields.map((fieldName) => {
    const field = resource.fields.find((f) => f.name === fieldName);
    if (!field) {
      throw new EvaluateError(`Field not found: ${fieldName}`);
    }
    const value = data?.[fieldName];
    const fieldErrors = errors?.[fieldName] ?? [];
    return toFormFieldVM(field, value, fieldErrors);
  });

  const actions = view.actions.map((a) => toActionVM(a, context, data ?? {}));

  const isValid = Object.keys(errors ?? {}).length === 0;

  return {
    type: "form",
    resource: resource.name,
    label: resource.label ?? resource.name,
    mode,
    id,
    fields,
    actions,
    isValid,
    isDirty: isDirty ?? false,
  };
}

// ============================================================
// Helper Functions
// ============================================================

function toListFieldVM(field: Field, view: ListView): ListFieldVM {
  return {
    name: field.name,
    label: field.label ?? field.name,
    kind: field.kind ?? "text",
    sortable: view.sortable?.includes(field.name),
    ui: field.ui,
    options: field.options,
    relation: field.relation,
  };
}

function toShowFieldVM(field: Field, value: unknown): ShowFieldVM {
  return {
    name: field.name,
    label: field.label ?? field.name,
    kind: field.kind ?? "text",
    value,
    ui: field.ui,
    options: field.options,
    relation: field.relation,
  };
}

function toFormFieldVM(
  field: Field,
  value: unknown,
  errors: string[],
): FormFieldVM {
  return {
    name: field.name,
    label: field.label ?? field.name,
    kind: field.kind ?? "text",
    value,
    required: field.required ?? false,
    readonly: field.readonly ?? false,
    validation: field.validation,
    errors,
    ui: field.ui,
    options: field.options,
    relation: field.relation,
  };
}

function toRowVM(
  row: Record<string, unknown>,
  view: ListView,
  resource: Resource,
  context: Context,
): RowVM {
  const id = String(row.id ?? "");

  const values: Record<string, unknown> = {};
  for (const colName of view.columns) {
    values[colName] = row[colName];
  }

  const rowActions = view.actions
    .filter((a) => a.placement === "row")
    .map((a) => toActionVM(a, context, row));

  return {
    id,
    values,
    actions: rowActions,
  };
}

function toActionVM(
  action: Action,
  context: Context,
  data: Record<string, unknown>,
): ActionVM {
  const allowed = action.allowedWhen
    ? evaluateExpression(action.allowedWhen, context, data)
    : true;

  return {
    id: action.id,
    label: action.label,
    allowed,
    confirm: action.confirm,
    ui: action.ui,
  };
}

function toFilters(view: ListView, activeFilter?: string): Filters {
  const named: NamedFilterVM[] = (view.namedFilters ?? []).map((f) => ({
    id: f.id,
    label: f.label,
    active: f.id === (activeFilter ?? view.namedFilters?.[0]?.id),
  }));

  return { named };
}

function toSelection(view: ListView, selected?: string[]): Selection {
  return {
    mode: view.selection ?? "none",
    selected: selected ?? [],
  };
}

function toSearch(view: ListView, query?: string): Search {
  return {
    fields: view.searchable ?? [],
    query: query ?? "",
  };
}

function toDefaultSort(view: ListView): SortVM | undefined {
  if (!view.defaultSort) return undefined;
  return {
    field: view.defaultSort.field,
    order: view.defaultSort.order,
  };
}

// ============================================================
// Expression Evaluation
// ============================================================

/**
 * allowedWhen 式を評価する
 *
 * サポートする式:
 * - role == 'admin'
 * - role != 'guest'
 * - status == 'draft'
 * - role == 'admin' || role == 'editor'
 * - role == 'admin' && status == 'draft'
 */
export function evaluateExpression(
  expression: string,
  context: Context,
  data: Record<string, unknown>,
): boolean {
  // 変数を解決するための環境
  const env: Record<string, unknown> = {
    ...data,
    role: context.role,
    user: context.user,
    permissions: context.permissions,
    ...context.custom,
  };

  try {
    return evalSimpleExpression(expression, env);
  } catch {
    // 評価エラーの場合は false を返す（安全側に倒す）
    return false;
  }
}

/**
 * シンプルな式を評価する
 * セキュリティのため、eval() は使わずパースする
 */
function evalSimpleExpression(
  expression: string,
  env: Record<string, unknown>,
): boolean {
  // || で分割（OR）
  const orParts = expression.split("||").map((s) => s.trim());
  if (orParts.length > 1) {
    return orParts.some((part) => evalSimpleExpression(part, env));
  }

  // && で分割（AND）
  const andParts = expression.split("&&").map((s) => s.trim());
  if (andParts.length > 1) {
    return andParts.every((part) => evalSimpleExpression(part, env));
  }

  // 比較式をパース
  const eqMatch = expression.match(/^(\w+)\s*==\s*'([^']*)'$/);
  if (eqMatch) {
    const [, varName, value] = eqMatch;
    return env[varName] === value;
  }

  const neqMatch = expression.match(/^(\w+)\s*!=\s*'([^']*)'$/);
  if (neqMatch) {
    const [, varName, value] = neqMatch;
    return env[varName] !== value;
  }

  // true/false リテラル
  if (expression === "true") return true;
  if (expression === "false") return false;

  throw new Error(`Unsupported expression: ${expression}`);
}

// ============================================================
// Errors
// ============================================================

export class EvaluateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvaluateError";
  }
}
