import type {
  CompiledField,
  CompiledInput,
  CompiledResource,
  CompiledSpecV2,
} from "@specloom/spec";
import { ResolverError } from "../errors.js";

export function getResource(
  spec: CompiledSpecV2,
  name: string,
): CompiledResource {
  const resource = spec.resources[name];
  if (!resource) {
    throw new ResolverError(`Resource not found: ${name}`);
  }
  return resource;
}

export function getInput(
  spec: CompiledSpecV2,
  name: string,
): CompiledInput {
  const input = spec.inputs?.[name];
  if (!input) {
    throw new ResolverError(`Input not found: ${name}`);
  }
  return input;
}

export function getField(
  resource: CompiledResource | CompiledInput,
  fieldName: string,
): CompiledField {
  const field = resource.fields[fieldName];
  if (!field) {
    throw new ResolverError(`Field not found: ${resource.name}.${fieldName}`);
  }
  return field;
}
