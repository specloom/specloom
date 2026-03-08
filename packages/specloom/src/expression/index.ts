import type { ExpressionAst } from "@specloom/spec";
import type { Context } from "../vm/types.js";

type ComparisonOperator = Extract<
  ExpressionAst,
  { type: "comparison" }
>["operator"];

export function evaluateExpression(
  ast: ExpressionAst | undefined,
  context: Context,
  record: Record<string, unknown> = {},
  fallback = true,
): boolean {
  if (!ast) {
    return fallback;
  }

  try {
    return Boolean(evaluateNode(ast, buildEnvironment(context, record)));
  } catch {
    return false;
  }
}

export function buildEnvironment(
  context: Context,
  record: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...record,
    record,
    role: context.role,
    user: context.user,
    permissions: context.permissions,
    ...context.custom,
  };
}

function evaluateNode(
  ast: ExpressionAst,
  env: Record<string, unknown>,
): unknown {
  switch (ast.type) {
    case "literal":
      return ast.value;
    case "identifier":
      return resolvePath(env, ast.path);
    case "comparison":
      return compare(
        evaluateNode(ast.left, env),
        evaluateNode(ast.right, env),
        ast.operator,
      );
    case "logical":
      if (ast.operator === "&&") {
        return (
          Boolean(evaluateNode(ast.left, env)) &&
          Boolean(evaluateNode(ast.right, env))
        );
      }
      return (
        Boolean(evaluateNode(ast.left, env)) ||
        Boolean(evaluateNode(ast.right, env))
      );
    case "unary":
      return !Boolean(evaluateNode(ast.operand, env));
  }
}

function compare(
  left: unknown,
  right: unknown,
  operator: ComparisonOperator,
): boolean {
  switch (operator) {
    case "==":
      return left === right;
    case "!=":
      return left !== right;
    case ">":
      return compareValues(left, right, (l, r) => l > r);
    case ">=":
      return compareValues(left, right, (l, r) => l >= r);
    case "<":
      return compareValues(left, right, (l, r) => l < r);
    case "<=":
      return compareValues(left, right, (l, r) => l <= r);
    default:
      return false;
  }
}

function compareValues(
  left: unknown,
  right: unknown,
  predicate: (left: string | number, right: string | number) => boolean,
): boolean {
  if (typeof left === "number" && typeof right === "number") {
    return predicate(left, right);
  }
  if (typeof left === "string" && typeof right === "string") {
    return predicate(left, right);
  }
  return false;
}

function resolvePath(env: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, segment) => {
    if (typeof value !== "object" || value === null) {
      return undefined;
    }
    return (value as Record<string, unknown>)[segment];
  }, env);
}
