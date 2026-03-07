import {
  parseSpecV2,
  validateSpecV2,
  type CompiledSpecV2,
} from "@specloom/spec";
import { LoaderError } from "../errors.js";

export function parseSpec(source: string): CompiledSpecV2 {
  try {
    return parseSpecV2(source);
  } catch (error) {
    throw wrapLoaderError(error);
  }
}

export function validateSpec(value: unknown): CompiledSpecV2 {
  try {
    return validateSpecV2(value);
  } catch (error) {
    throw wrapLoaderError(error);
  }
}

function wrapLoaderError(error: unknown): LoaderError {
  return new LoaderError(error instanceof Error ? error.message : "Invalid spec");
}
