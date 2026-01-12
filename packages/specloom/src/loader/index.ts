import type { Spec } from "../spec/index.js";

/**
 * JSON 文字列から Spec をパースする
 */
export function parseSpec(json: string): Spec {
  const data = JSON.parse(json);
  return validateSpec(data);
}

/**
 * オブジェクトを Spec として検証する
 */
export function validateSpec(data: unknown): Spec {
  if (!isObject(data)) {
    throw new SpecError("Spec must be an object");
  }

  if (data.version !== "0.1") {
    throw new SpecError(`Unsupported version: ${data.version}`);
  }

  if (!Array.isArray(data.resources)) {
    throw new SpecError("Spec must have resources array");
  }

  if (!Array.isArray(data.views)) {
    throw new SpecError("Spec must have views array");
  }

  return data as unknown as Spec;
}

/**
 * Spec 読み込みエラー
 */
export class SpecError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpecError";
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
