import {
  parseSpec as parseCompiledSpec,
  validateSpec as validateCompiledSpec,
  type CompiledSpec,
} from "@specloom/spec";
import { LoaderError } from "../errors.js";

export function parseSpec(source: string): CompiledSpec {
  try {
    return parseCompiledSpec(source);
  } catch (error) {
    throw wrapLoaderError(error);
  }
}

export function validateSpec(value: unknown): CompiledSpec {
  try {
    return validateCompiledSpec(value);
  } catch (error) {
    throw wrapLoaderError(error);
  }
}

function wrapLoaderError(error: unknown): LoaderError {
  return new LoaderError(
    error instanceof Error ? error.message : "Invalid spec",
  );
}
