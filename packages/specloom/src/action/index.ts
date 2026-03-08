import type { CompiledAction } from "@specloom/spec";
import type { ActionVM } from "../vm/types.js";

type ActionRequestSource = Pick<
  CompiledAction,
  "id" | "selection" | "operation"
>;

export interface BuildActionRequestArgs {
  action: ActionRequestSource | ActionVM;
  record?: Record<string, unknown>;
  args?: Record<string, unknown>;
  input?: Record<string, unknown>;
  selected?: string[];
  selectionQuery?: Record<string, unknown>;
}

export interface ActionRequestDescriptor {
  id: string;
  method: string;
  path: string;
  selection: "none" | "selected" | "query";
  args?: Record<string, unknown>;
  input?: Record<string, unknown>;
  selected?: string[];
  selectionQuery?: Record<string, unknown>;
}

export function buildActionRequest(
  args: BuildActionRequestArgs,
): ActionRequestDescriptor {
  const {
    action,
    record,
    args: requestArgs,
    input,
    selected,
    selectionQuery,
  } = args;
  const path = interpolateActionPath(action.operation.path, {
    ...record,
    ...requestArgs,
  });

  return {
    id: action.id,
    method: action.operation.method,
    path,
    selection: action.selection ?? "none",
    ...(requestArgs ? { args: requestArgs } : {}),
    ...(input ? { input } : {}),
    ...(selected ? { selected } : {}),
    ...(selectionQuery ? { selectionQuery } : {}),
  };
}

export function interpolateActionPath(
  path: string,
  values: Record<string, unknown> = {},
): string {
  return path.replace(/\{([^}]+)\}/g, (_, key) => {
    const value = resolvePath(values, key.trim());
    return encodeURIComponent(String(value ?? ""));
  });
}

function resolvePath(record: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, segment) => {
    if (typeof value !== "object" || value === null) {
      return undefined;
    }
    return (value as Record<string, unknown>)[segment];
  }, record);
}
