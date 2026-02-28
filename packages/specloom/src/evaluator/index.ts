import type {
  Resource,
  Field,
  ListView,
  ShowView,
  FormView,
  Action,
  FilterOperator,
} from "../spec/index.js";
import type {
  Context,
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
import type { ValidationErrors } from "../validation/index.js";
import { i18n } from "../i18n/index.js";

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

  const pageActions = view.actions
    .filter((a) => !a.selection)
    .map((a) => toActionVM(a, context, {}));

  const bulkActions = view.actions
    .filter((a) => a.selection)
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
    pageActions,
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
    return toShowFieldVM(field, data[fieldName], context, data);
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

  const fields = view.fields
    .filter((fieldName) => {
      if (mode === "edit") {
        const field = resource.fields.find((f) => f.name === fieldName);
        if (field?.createOnly) return false;
      }
      return true;
    })
    .map((fieldName) => {
      const field = resource.fields.find((f) => f.name === fieldName);
      if (!field) {
        throw new EvaluateError(`Field not found: ${fieldName}`);
      }
      const value = data?.[fieldName];
      const fieldErrors = errors?.[fieldName] ?? [];
      return toFormFieldVM(field, value, fieldErrors, mode, context, data ?? {});
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

function toShowFieldVM(
  field: Field,
  value: unknown,
  context: Context,
  data: Record<string, unknown>,
): ShowFieldVM {
  const visible = field.visibleWhen
    ? evaluateExpression(field.visibleWhen, context, data)
    : undefined;

  return {
    name: field.name,
    label: field.label ?? field.name,
    kind: field.kind ?? "text",
    value,
    visible,
    ui: field.ui,
    options: field.options,
    relation: field.relation,
  };
}

function toFormFieldVM(
  field: Field,
  value: unknown,
  errors: string[],
  mode: "create" | "edit",
  context: Context,
  data: Record<string, unknown>,
): FormFieldVM {
  const createOnly = field.createOnly ?? false;
  const readonly = field.readonly === true || (mode === "edit" && createOnly);

  const visible = field.visibleWhen
    ? evaluateExpression(field.visibleWhen, context, data)
    : undefined;

  const requiredBySpec = field.required ?? false;
  const requiredByWhen = field.requiredWhen
    ? evaluateExpression(field.requiredWhen, context, data)
    : false;
  const required = requiredBySpec || requiredByWhen;

  return {
    name: field.name,
    label: field.label ?? field.name,
    kind: field.kind ?? "text",
    value,
    required,
    readonly,
    createOnly,
    visible,
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

  const rowActions = (view.rowActions ?? []).map((a) =>
    toActionVM(a, context, row),
  );

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

  const t = i18n.t();
  const confirm =
    action.confirm === true
      ? t.action.confirm
      : typeof action.confirm === "string"
        ? action.confirm
        : undefined;

  return {
    id: action.id,
    label: action.label,
    allowed,
    confirm,
    ui: action.ui,
    dialog: action.dialog,
    api: action.api,
  };
}

function toFilters(view: ListView, activeFilter?: string): Filters {
  const named: NamedFilterVM[] = (view.namedFilters ?? []).map((f) => ({
    id: f.id,
    label: f.label,
    active: f.id === (activeFilter ?? view.namedFilters?.[0]?.id),
    filter: normalizeFilterExpression(f.filter),
  }));

  return { named };
}

/**
 * 演算子の legacy alias（camelCase）を正規化する
 */
function normalizeFilterOperator(operator: string): string {
  switch (operator) {
    case "startsWith":
      return "starts_with";
    case "endsWith":
      return "ends_with";
    case "notIn":
      return "not_in";
    case "isNull":
      return "is_null";
    case "isEmpty":
      return "is_empty";
    case "hasAny":
      return "has_any";
    case "hasAll":
      return "has_all";
    case "hasNone":
      return "has_none";
    default:
      return operator;
  }
}

const FILTER_OPERATORS: ReadonlySet<string> = new Set([
  "eq",
  "ne",
  "gt",
  "gte",
  "lt",
  "lte",
  "contains",
  "starts_with",
  "ends_with",
  "matches",
  "ilike",
  "in",
  "not_in",
  "is_null",
  "is_empty",
  "has_any",
  "has_all",
  "has_none",
]);

function isFilterOperator(value: string): value is FilterOperator {
  return FILTER_OPERATORS.has(value);
}

/**
 * unknown から FilterExpression を正規化して取り出す
 * - operator / op の両方を受け付ける
 * - legacy operator（camelCase）を snake_case に変換する
 */
function normalizeFilterExpression(value: unknown): Filters["custom"] {
  if (value == null || typeof value !== "object") return undefined;
  const obj = value as Record<string, unknown>;

  if ("and" in obj) {
    if (!Array.isArray(obj.and)) return undefined;
    const and = obj.and
      .map((child) => normalizeFilterExpression(child))
      .filter(
        (child): child is NonNullable<Filters["custom"]> => child != null,
      );
    if (and.length !== obj.and.length) return undefined;
    return { and };
  }

  if ("or" in obj) {
    if (!Array.isArray(obj.or)) return undefined;
    const or = obj.or
      .map((child) => normalizeFilterExpression(child))
      .filter(
        (child): child is NonNullable<Filters["custom"]> => child != null,
      );
    if (or.length !== obj.or.length) return undefined;
    return { or };
  }

  if ("not" in obj) {
    const not = normalizeFilterExpression(obj.not);
    if (!not) return undefined;
    return { not };
  }

  if (!("field" in obj) || !("value" in obj) || typeof obj.field !== "string") {
    return undefined;
  }

  const rawOperator =
    typeof obj.operator === "string"
      ? obj.operator
      : typeof obj.op === "string"
        ? obj.op
        : undefined;

  if (!rawOperator) return undefined;
  const operator = normalizeFilterOperator(rawOperator);
  if (!isFilterOperator(operator)) {
    return undefined;
  }

  return {
    field: obj.field,
    operator,
    value: obj.value,
  };
}

function toSelection(view: ListView, selected?: string[]): Selection {
  return {
    mode: view.selectionMode ?? "none",
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
 * - count >= 10
 * - score < 100
 * - status == 'draft'
 * - role == 'admin' || role == 'editor'
 * - role == 'admin' && status == 'draft'
 * - (role == 'admin' || role == 'editor') && status == 'draft'
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
 * 式が文法的に有効かどうかを検証する（評価はしない）
 */
export function isExpressionSyntaxValid(expression: string): boolean {
  try {
    const parser = new ExpressionParser(expression, {});
    parser.parse(false);
    return true;
  } catch {
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
  const parser = new ExpressionParser(expression, env);
  return parser.parse();
}

type TokenType =
  | "LPAREN"
  | "RPAREN"
  | "AND"
  | "OR"
  | "EQ"
  | "NEQ"
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "IDENT"
  | "STRING"
  | "NUMBER"
  | "TRUE"
  | "FALSE"
  | "EOF";

interface Token {
  type: TokenType;
  value?: string;
}

class ExpressionParser {
  private readonly tokens: Token[];
  private pos = 0;

  constructor(
    private readonly expression: string,
    private readonly env: Record<string, unknown>,
  ) {
    this.tokens = this.tokenize(expression);
  }

  parse(evaluate = true): boolean {
    const result = this.parseOr(evaluate);
    this.expect("EOF");
    return result;
  }

  private parseOr(evaluate: boolean): boolean {
    let result = this.parseAnd(evaluate);
    while (this.peek().type === "OR") {
      this.consume("OR");
      const shouldEvaluateRhs = evaluate && !result;
      const rhs = this.parseAnd(shouldEvaluateRhs);
      if (evaluate) {
        result = result || rhs;
      }
    }
    return evaluate ? result : false;
  }

  private parseAnd(evaluate: boolean): boolean {
    let result = this.parsePrimary(evaluate);
    while (this.peek().type === "AND") {
      this.consume("AND");
      const shouldEvaluateRhs = evaluate && result;
      const rhs = this.parsePrimary(shouldEvaluateRhs);
      if (evaluate) {
        result = result && rhs;
      }
    }
    return evaluate ? result : false;
  }

  private parsePrimary(evaluate: boolean): boolean {
    const token = this.peek();

    if (token.type === "LPAREN") {
      this.consume("LPAREN");
      const value = this.parseOr(evaluate);
      this.expect("RPAREN");
      return value;
    }

    if (token.type === "TRUE") {
      this.consume("TRUE");
      return evaluate ? true : false;
    }

    if (token.type === "FALSE") {
      this.consume("FALSE");
      return false;
    }

    return this.parseComparison(evaluate);
  }

  private parseComparison(evaluate: boolean): boolean {
    const identifier = this.consume("IDENT").value!;
    const op = this.peek();
    if (
      op.type !== "EQ" &&
      op.type !== "NEQ" &&
      op.type !== "GT" &&
      op.type !== "GTE" &&
      op.type !== "LT" &&
      op.type !== "LTE"
    ) {
      throw new Error(`Expected comparison operator near '${identifier}'`);
    }
    this.pos += 1;
    const rhs = this.parseLiteral();
    if (!evaluate) {
      return false;
    }
    const lhsValue = resolveValue(this.env, identifier);
    return compareValues(lhsValue, rhs, op.type);
  }

  private parseLiteral(): string | number | boolean {
    const token = this.peek();
    if (token.type === "STRING") {
      return this.consume("STRING").value!;
    }
    if (token.type === "NUMBER") {
      return Number(this.consume("NUMBER").value!);
    }
    if (token.type === "TRUE") {
      this.consume("TRUE");
      return true;
    }
    if (token.type === "FALSE") {
      this.consume("FALSE");
      return false;
    }
    throw new Error("Expected literal");
  }

  private tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < expression.length) {
      const ch = expression[i];

      if (/\s/.test(ch)) {
        i += 1;
        continue;
      }

      if (expression.startsWith("&&", i)) {
        tokens.push({ type: "AND" });
        i += 2;
        continue;
      }

      if (expression.startsWith("||", i)) {
        tokens.push({ type: "OR" });
        i += 2;
        continue;
      }

      if (expression.startsWith("==", i)) {
        tokens.push({ type: "EQ" });
        i += 2;
        continue;
      }

      if (expression.startsWith("!=", i)) {
        tokens.push({ type: "NEQ" });
        i += 2;
        continue;
      }

      if (expression.startsWith(">=", i)) {
        tokens.push({ type: "GTE" });
        i += 2;
        continue;
      }

      if (expression.startsWith("<=", i)) {
        tokens.push({ type: "LTE" });
        i += 2;
        continue;
      }

      if (ch === ">") {
        tokens.push({ type: "GT" });
        i += 1;
        continue;
      }

      if (ch === "<") {
        tokens.push({ type: "LT" });
        i += 1;
        continue;
      }

      if (ch === "(") {
        tokens.push({ type: "LPAREN" });
        i += 1;
        continue;
      }

      if (ch === ")") {
        tokens.push({ type: "RPAREN" });
        i += 1;
        continue;
      }

      if (ch === "'") {
        const { value, nextIndex } = readSingleQuotedString(expression, i);
        tokens.push({ type: "STRING", value });
        i = nextIndex;
        continue;
      }

      const numMatch = expression.slice(i).match(/^-?\d+(?:\.\d+)?/);
      if (numMatch) {
        tokens.push({ type: "NUMBER", value: numMatch[0] });
        i += numMatch[0].length;
        continue;
      }

      const identMatch = expression.slice(i).match(/^[A-Za-z_][A-Za-z0-9_.]*/);
      if (identMatch) {
        const ident = identMatch[0];
        if (ident === "true") {
          tokens.push({ type: "TRUE" });
        } else if (ident === "false") {
          tokens.push({ type: "FALSE" });
        } else {
          tokens.push({ type: "IDENT", value: ident });
        }
        i += ident.length;
        continue;
      }

      throw new Error(`Unexpected token in expression: '${ch}'`);
    }

    tokens.push({ type: "EOF" });
    return tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos] ?? { type: "EOF" };
  }

  private consume(type: TokenType): Token {
    const token = this.tokens[this.pos];
    if (!token || token.type !== type) {
      throw new Error(`Expected token '${type}'`);
    }
    this.pos += 1;
    return token;
  }

  private expect(type: TokenType): void {
    this.consume(type);
  }
}

function readSingleQuotedString(
  source: string,
  startIndex: number,
): { value: string; nextIndex: number } {
  let i = startIndex + 1;
  let value = "";

  while (i < source.length) {
    const ch = source[i];
    if (ch === "\\") {
      if (i + 1 < source.length) {
        value += source[i + 1];
        i += 2;
        continue;
      }
      throw new Error("Invalid escape sequence");
    }
    if (ch === "'") {
      return { value, nextIndex: i + 1 };
    }
    value += ch;
    i += 1;
  }

  throw new Error("Unterminated string literal");
}

function resolveValue(env: Record<string, unknown>, keyPath: string): unknown {
  if (!keyPath.includes(".")) {
    return env[keyPath];
  }

  const parts = keyPath.split(".");
  let current: unknown = env;
  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function compareValues(
  lhs: unknown,
  rhs: string | number | boolean,
  operator: "EQ" | "NEQ" | "GT" | "GTE" | "LT" | "LTE",
): boolean {
  switch (operator) {
    case "EQ":
      return lhs === rhs;
    case "NEQ":
      return lhs !== rhs;
    case "GT":
    case "GTE":
    case "LT":
    case "LTE": {
      if (typeof lhs === "number" && typeof rhs === "number") {
        if (operator === "GT") return lhs > rhs;
        if (operator === "GTE") return lhs >= rhs;
        if (operator === "LT") return lhs < rhs;
        return lhs <= rhs;
      }
      if (typeof lhs === "string" && typeof rhs === "string") {
        if (operator === "GT") return lhs > rhs;
        if (operator === "GTE") return lhs >= rhs;
        if (operator === "LT") return lhs < rhs;
        return lhs <= rhs;
      }
      throw new Error(
        `Operator ${operator} requires matching number or string operands`,
      );
    }
  }
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
