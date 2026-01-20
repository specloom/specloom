// ============================================================
// Filter Evaluator
// ============================================================

import type {
  FilterExpression,
  FilterCondition,
  FilterOperator,
} from "../spec/index.js";

/**
 * フィルター式をデータに対して評価する
 */
export function evaluateFilter(
  filter: FilterExpression,
  data: Record<string, unknown>,
): boolean {
  // AND
  if ("and" in filter) {
    return filter.and.every((expr) => evaluateFilter(expr, data));
  }

  // OR
  if ("or" in filter) {
    return filter.or.some((expr) => evaluateFilter(expr, data));
  }

  // NOT
  if ("not" in filter) {
    return !evaluateFilter(filter.not, data);
  }

  // FilterCondition
  return evaluateCondition(filter, data);
}

/**
 * 単一条件を評価する
 */
function evaluateCondition(
  condition: FilterCondition,
  data: Record<string, unknown>,
): boolean {
  const { field, op, value } = condition;
  const fieldValue = getFieldValue(data, field);

  return evaluateOperator(op, fieldValue, value);
}

/**
 * ドット記法でネストしたフィールド値を取得
 */
function getFieldValue(data: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = data;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * 演算子を評価する
 */
function evaluateOperator(
  op: FilterOperator,
  fieldValue: unknown,
  compareValue: unknown,
): boolean {
  switch (op) {
    // 比較演算子
    case "eq":
      return fieldValue === compareValue;

    case "ne":
      return fieldValue !== compareValue;

    case "gt":
      return (
        typeof fieldValue === "number" &&
        typeof compareValue === "number" &&
        fieldValue > compareValue
      );

    case "gte":
      return (
        typeof fieldValue === "number" &&
        typeof compareValue === "number" &&
        fieldValue >= compareValue
      );

    case "lt":
      return (
        typeof fieldValue === "number" &&
        typeof compareValue === "number" &&
        fieldValue < compareValue
      );

    case "lte":
      return (
        typeof fieldValue === "number" &&
        typeof compareValue === "number" &&
        fieldValue <= compareValue
      );

    // 文字列演算子
    case "contains":
      return (
        typeof fieldValue === "string" &&
        typeof compareValue === "string" &&
        fieldValue.includes(compareValue)
      );

    case "startsWith":
      return (
        typeof fieldValue === "string" &&
        typeof compareValue === "string" &&
        fieldValue.startsWith(compareValue)
      );

    case "endsWith":
      return (
        typeof fieldValue === "string" &&
        typeof compareValue === "string" &&
        fieldValue.endsWith(compareValue)
      );

    case "matches":
      if (typeof fieldValue !== "string" || typeof compareValue !== "string") {
        return false;
      }
      try {
        return new RegExp(compareValue).test(fieldValue);
      } catch {
        return false;
      }

    case "ilike":
      return (
        typeof fieldValue === "string" &&
        typeof compareValue === "string" &&
        fieldValue.toLowerCase().includes(compareValue.toLowerCase())
      );

    // 集合演算子
    case "in":
      return Array.isArray(compareValue) && compareValue.includes(fieldValue);

    case "notIn":
      return Array.isArray(compareValue) && !compareValue.includes(fieldValue);

    // 存在演算子
    case "isNull":
      return compareValue
        ? fieldValue === null || fieldValue === undefined
        : fieldValue !== null && fieldValue !== undefined;

    case "isEmpty":
      if (compareValue) {
        return (
          fieldValue === "" ||
          fieldValue === null ||
          fieldValue === undefined ||
          (Array.isArray(fieldValue) && fieldValue.length === 0)
        );
      }
      return (
        fieldValue !== "" &&
        fieldValue !== null &&
        fieldValue !== undefined &&
        !(Array.isArray(fieldValue) && fieldValue.length === 0)
      );

    // 配列演算子
    case "hasAny":
      return (
        Array.isArray(fieldValue) &&
        Array.isArray(compareValue) &&
        compareValue.some((v) => fieldValue.includes(v))
      );

    case "hasAll":
      return (
        Array.isArray(fieldValue) &&
        Array.isArray(compareValue) &&
        compareValue.every((v) => fieldValue.includes(v))
      );

    case "hasNone":
      return (
        Array.isArray(fieldValue) &&
        Array.isArray(compareValue) &&
        !compareValue.some((v) => fieldValue.includes(v))
      );

    default:
      return false;
  }
}

/**
 * フィルター式が有効かどうかを検証する（型ガード）
 */
export function isFilterExpression(value: unknown): value is FilterExpression {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // AND
  if ("and" in obj) {
    return (
      Array.isArray(obj.and) && obj.and.every((v) => isFilterExpression(v))
    );
  }

  // OR
  if ("or" in obj) {
    return Array.isArray(obj.or) && obj.or.every((v) => isFilterExpression(v));
  }

  // NOT
  if ("not" in obj) {
    return isFilterExpression(obj.not);
  }

  // FilterCondition
  return (
    "field" in obj &&
    "op" in obj &&
    "value" in obj &&
    typeof obj.field === "string" &&
    typeof obj.op === "string"
  );
}
