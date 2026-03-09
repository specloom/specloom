import type { CompiledNamedFilter, FilterExpression, FilterValue } from "@specloom/spec";
import { buildEnvironment } from "../expression/index.js";
import type { Context } from "../vm/types.js";

export interface ResolveFilterValueArgs {
  value: FilterValue;
  context?: Context;
  now?: Date;
}

export interface EvaluateFilterArgs {
  filter: FilterExpression;
  record: Record<string, unknown>;
  context?: Context;
  now?: Date;
}

export interface FilterRecordsArgs {
  data: Record<string, unknown>[];
  filter: FilterExpression;
  context?: Context;
  now?: Date;
}

export interface ApplyNamedFilterArgs {
  data: Record<string, unknown>[];
  namedFilter: CompiledNamedFilter;
  context?: Context;
  now?: Date;
}

export function resolveFilterValue(args: ResolveFilterValueArgs): unknown {
  const { value, context = {}, now = new Date() } = args;

  if (value && typeof value === "object" && !Array.isArray(value)) {
    if ("context" in value && typeof value.context === "string") {
      return resolvePath(buildEnvironment(context, {}), value.context);
    }

    if ("relative" in value && typeof value.relative === "string") {
      return toRelativeIso(now, value.relative);
    }
  }

  return value;
}

export function evaluateFilter(args: EvaluateFilterArgs): boolean {
  const { filter, record, context = {}, now = new Date() } = args;

  if (isEmptyFilter(filter)) {
    return true;
  }

  if ("and" in filter) {
    return filter.and.every((child) =>
      evaluateFilter({ filter: child, record, context, now }),
    );
  }

  if ("or" in filter) {
    return filter.or.some((child) =>
      evaluateFilter({ filter: child, record, context, now }),
    );
  }

  if ("not" in filter) {
    return !evaluateFilter({ filter: filter.not, record, context, now });
  }

  const left = resolvePath(record, filter.field);
  const right = resolveFilterValue({
    value: filter.value,
    context,
    now,
  });

  return compareFilterValues(left, right, filter.operator);
}

export function filterRecords(args: FilterRecordsArgs): Record<string, unknown>[] {
  const { data, filter, context, now } = args;
  return data.filter((record) =>
    evaluateFilter({
      filter,
      record,
      context,
      now,
    }),
  );
}

export function applyNamedFilter(args: ApplyNamedFilterArgs): Record<string, unknown>[] {
  const { data, namedFilter, context, now } = args;
  return filterRecords({
    data,
    filter: namedFilter.conditions,
    context,
    now,
  });
}

function compareFilterValues(left: unknown, right: unknown, operator: string): boolean {
  switch (operator) {
    case "eq":
    case "==":
      return left === right;
    case "neq":
    case "!=":
      return left !== right;
    case "contains":
      return String(left ?? "")
        .toLowerCase()
        .includes(String(right ?? "").toLowerCase());
    case "notContains":
      return !String(left ?? "")
        .toLowerCase()
        .includes(String(right ?? "").toLowerCase());
    case "startsWith":
      return String(left ?? "")
        .toLowerCase()
        .startsWith(String(right ?? "").toLowerCase());
    case "endsWith":
      return String(left ?? "")
        .toLowerCase()
        .endsWith(String(right ?? "").toLowerCase());
    case "in":
      return Array.isArray(right) ? right.includes(left as never) : false;
    case "notIn":
      return Array.isArray(right) ? !right.includes(left as never) : true;
    case "gt":
    case ">":
      return compareOrdered(left, right, (a, b) => a > b);
    case "gte":
    case ">=":
      return compareOrdered(left, right, (a, b) => a >= b);
    case "lt":
    case "<":
      return compareOrdered(left, right, (a, b) => a < b);
    case "lte":
    case "<=":
      return compareOrdered(left, right, (a, b) => a <= b);
    case "exists":
      return left !== undefined && left !== null && left !== "";
    case "notExists":
      return left === undefined || left === null || left === "";
    default:
      return left === right;
  }
}

function compareOrdered(
  left: unknown,
  right: unknown,
  predicate: (left: string | number, right: string | number) => boolean,
): boolean {
  if (typeof left === "number" && typeof right === "number") {
    return predicate(left, right);
  }

  const leftDate = toTimestamp(left);
  const rightDate = toTimestamp(right);
  if (leftDate !== undefined && rightDate !== undefined) {
    return predicate(leftDate, rightDate);
  }

  if (typeof left === "string" && typeof right === "string") {
    return predicate(left, right);
  }

  return false;
}

function toTimestamp(value: unknown): number | undefined {
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function resolvePath(record: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, segment) => {
    if (typeof value !== "object" || value === null) {
      return undefined;
    }
    return (value as Record<string, unknown>)[segment];
  }, record);
}

function isEmptyFilter(filter: FilterExpression): boolean {
  return !("field" in filter || "and" in filter || "or" in filter || "not" in filter);
}

function toRelativeIso(now: Date, expression: string): string {
  const match = /^([+-]?\d+)([smhdw])$/.exec(expression.trim());
  if (!match) {
    return now.toISOString();
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000,
  };

  return new Date(now.getTime() + amount * multipliers[unit]!).toISOString();
}
