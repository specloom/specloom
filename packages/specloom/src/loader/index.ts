import type { Spec } from "../spec/index.js";
import { isExpressionSyntaxValid } from "../evaluator/index.js";

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

  const resourceNames = new Set<string>();
  const resourceFields = new Map<string, Set<string>>();
  for (let i = 0; i < data.resources.length; i += 1) {
    const fieldNames = validateResource(data.resources[i], i);
    const name = (data.resources[i] as Record<string, unknown>).name as string;
    if (resourceNames.has(name)) {
      throw new SpecError(`resources[${i}].name is duplicated: ${name}`);
    }
    resourceNames.add(name);
    resourceFields.set(name, fieldNames);
  }

  for (let i = 0; i < data.views.length; i += 1) {
    const resource = (data.views[i] as Record<string, unknown>).resource;
    const fieldNames =
      typeof resource === "string" ? resourceFields.get(resource) : undefined;
    validateView(data.views[i], i, fieldNames);
    if (typeof resource === "string" && !resourceNames.has(resource)) {
      throw new SpecError(
        `views[${i}].resource references unknown resource: ${resource}`,
      );
    }
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

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function validateResource(resource: unknown, index: number): Set<string> {
  if (!isObject(resource)) {
    throw new SpecError(`resources[${index}] must be an object`);
  }
  if (typeof resource.name !== "string" || resource.name.length === 0) {
    throw new SpecError(`resources[${index}].name must be a non-empty string`);
  }
  if (!Array.isArray(resource.fields)) {
    throw new SpecError(`resources[${index}].fields must be an array`);
  }
  const fieldNames = new Set<string>();
  for (let j = 0; j < resource.fields.length; j += 1) {
    const path = `resources[${index}].fields[${j}]`;
    validateField(resource.fields[j], path);
    const name = (resource.fields[j] as Record<string, unknown>).name as string;
    if (fieldNames.has(name)) {
      throw new SpecError(`${path}.name is duplicated: ${name}`);
    }
    fieldNames.add(name);
  }
  if (resource.validation !== undefined) {
    validateResourceValidation(
      resource.validation,
      `resources[${index}].validation`,
    );
  }

  return fieldNames;
}

function validateResourceValidation(value: unknown, path: string): void {
  if (!isObject(value)) {
    throw new SpecError(`${path} must be an object`);
  }
  if (value.requiredOneOf !== undefined) {
    if (
      !Array.isArray(value.requiredOneOf) ||
      !value.requiredOneOf.every(isStringArray)
    ) {
      throw new SpecError(`${path}.requiredOneOf must be string[][]`);
    }
  }
}

function validateField(field: unknown, path: string): void {
  if (!isObject(field)) {
    throw new SpecError(`${path} must be an object`);
  }
  if (typeof field.name !== "string" || field.name.length === 0) {
    throw new SpecError(`${path}.name must be a non-empty string`);
  }
  if (typeof field.type !== "string" || field.type.length === 0) {
    throw new SpecError(`${path}.type must be a non-empty string`);
  }
  if (field.validation !== undefined) {
    validateFieldValidation(field.validation, `${path}.validation`);
  }
  if (field.ui !== undefined && !isObject(field.ui)) {
    throw new SpecError(`${path}.ui must be an object`);
  }
  if (field.filter !== undefined) {
    const filter = field.filter;
    if (filter !== true && !isStringArray(filter)) {
      throw new SpecError(`${path}.filter must be true or string[]`);
    }
  }
  if (field.options !== undefined) {
    if (
      !Array.isArray(field.options) ||
      !field.options.every(
        (opt) =>
          isObject(opt) &&
          typeof opt.value === "string" &&
          typeof opt.label === "string",
      )
    ) {
      throw new SpecError(`${path}.options must be {value,label}[]`);
    }
  }
  if (field.relation !== undefined) {
    validateRelation(field.relation, `${path}.relation`);
  }
  if (field.visibleWhen !== undefined) {
    if (typeof field.visibleWhen !== "string") {
      throw new SpecError(`${path}.visibleWhen must be a string`);
    }
    if (!isExpressionSyntaxValid(field.visibleWhen)) {
      throw new SpecError(
        `${path}.visibleWhen has invalid syntax: "${field.visibleWhen}"`,
      );
    }
  }
  if (field.requiredWhen !== undefined) {
    if (typeof field.requiredWhen !== "string") {
      throw new SpecError(`${path}.requiredWhen must be a string`);
    }
    if (!isExpressionSyntaxValid(field.requiredWhen)) {
      throw new SpecError(
        `${path}.requiredWhen has invalid syntax: "${field.requiredWhen}"`,
      );
    }
  }
}

function validateFieldValidation(value: unknown, path: string): void {
  if (!isObject(value)) {
    throw new SpecError(`${path} must be an object`);
  }

  if (value.required !== undefined && typeof value.required !== "boolean") {
    throw new SpecError(`${path}.required must be a boolean`);
  }
  if (value.minLength !== undefined && typeof value.minLength !== "number") {
    throw new SpecError(`${path}.minLength must be a number`);
  }
  if (value.maxLength !== undefined && typeof value.maxLength !== "number") {
    throw new SpecError(`${path}.maxLength must be a number`);
  }
  if (value.min !== undefined && typeof value.min !== "number") {
    throw new SpecError(`${path}.min must be a number`);
  }
  if (value.max !== undefined && typeof value.max !== "number") {
    throw new SpecError(`${path}.max must be a number`);
  }
  if (value.pattern !== undefined && typeof value.pattern !== "string") {
    throw new SpecError(`${path}.pattern must be a string`);
  }
  if (value.match !== undefined && typeof value.match !== "string") {
    throw new SpecError(`${path}.match must be a string`);
  }
  if (value.minItems !== undefined && typeof value.minItems !== "number") {
    throw new SpecError(`${path}.minItems must be a number`);
  }
  if (value.maxItems !== undefined && typeof value.maxItems !== "number") {
    throw new SpecError(`${path}.maxItems must be a number`);
  }
}

function validateRelation(value: unknown, path: string): void {
  if (!isObject(value)) {
    throw new SpecError(`${path} must be an object`);
  }
  if (typeof value.resource !== "string" || value.resource.length === 0) {
    throw new SpecError(`${path}.resource must be a non-empty string`);
  }
  if (typeof value.labelField !== "string" || value.labelField.length === 0) {
    throw new SpecError(`${path}.labelField must be a non-empty string`);
  }
  if (
    value.valueField !== undefined &&
    (typeof value.valueField !== "string" || value.valueField.length === 0)
  ) {
    throw new SpecError(`${path}.valueField must be a non-empty string`);
  }
  if (value.searchable !== undefined && typeof value.searchable !== "boolean") {
    throw new SpecError(`${path}.searchable must be a boolean`);
  }
  if (
    value.cardinality !== undefined &&
    value.cardinality !== "one" &&
    value.cardinality !== "many"
  ) {
    throw new SpecError(`${path}.cardinality must be "one" or "many"`);
  }
}

function validateView(
  view: unknown,
  index: number,
  resourceFieldNames?: Set<string>,
): void {
  if (!isObject(view)) {
    throw new SpecError(`views[${index}] must be an object`);
  }
  if (typeof view.resource !== "string" || view.resource.length === 0) {
    throw new SpecError(`views[${index}].resource must be a non-empty string`);
  }
  if (view.type !== "list" && view.type !== "form" && view.type !== "show") {
    throw new SpecError(`views[${index}].type must be list|form|show`);
  }
  if (!Array.isArray(view.actions)) {
    throw new SpecError(`views[${index}].actions must be an array`);
  }
  for (let j = 0; j < view.actions.length; j += 1) {
    validateAction(view.actions[j], `views[${index}].actions[${j}]`);
  }

  if (view.type === "list") {
    if (!isStringArray(view.columns)) {
      throw new SpecError(`views[${index}].columns must be string[]`);
    }
    if (resourceFieldNames) {
      for (let j = 0; j < view.columns.length; j += 1) {
        if (!resourceFieldNames.has(view.columns[j])) {
          throw new SpecError(
            `views[${index}].columns[${j}] references unknown field: ${view.columns[j]}`,
          );
        }
      }
    }
    if (view.rowActions !== undefined) {
      if (!Array.isArray(view.rowActions)) {
        throw new SpecError(`views[${index}].rowActions must be an array`);
      }
      for (let j = 0; j < view.rowActions.length; j += 1) {
        validateAction(view.rowActions[j], `views[${index}].rowActions[${j}]`);
      }
    }
    if (view.searchable !== undefined && !isStringArray(view.searchable)) {
      throw new SpecError(`views[${index}].searchable must be string[]`);
    }
    if (view.sortable !== undefined && !isStringArray(view.sortable)) {
      throw new SpecError(`views[${index}].sortable must be string[]`);
    }
    if (view.namedFilters !== undefined) {
      validateNamedFilters(view.namedFilters, `views[${index}].namedFilters`);
    }
    if (view.selectionMode !== undefined) {
      const mode = view.selectionMode;
      if (mode !== "none" && mode !== "single" && mode !== "multi") {
        throw new SpecError(
          `views[${index}].selectionMode must be none|single|multi`,
        );
      }
    }
    if (view.defaultSort !== undefined) {
      if (
        !isObject(view.defaultSort) ||
        typeof view.defaultSort.field !== "string" ||
        (view.defaultSort.order !== "asc" && view.defaultSort.order !== "desc")
      ) {
        throw new SpecError(
          `views[${index}].defaultSort must be {field, order}`,
        );
      }
    }
  } else {
    if (!isStringArray(view.fields)) {
      throw new SpecError(`views[${index}].fields must be string[]`);
    }
    if (resourceFieldNames) {
      for (let j = 0; j < view.fields.length; j += 1) {
        if (!resourceFieldNames.has(view.fields[j])) {
          throw new SpecError(
            `views[${index}].fields[${j}] references unknown field: ${view.fields[j]}`,
          );
        }
      }
    }
  }
}

function validateNamedFilters(value: unknown, path: string): void {
  if (!Array.isArray(value)) {
    throw new SpecError(`${path} must be an array`);
  }
  for (let i = 0; i < value.length; i += 1) {
    const item = value[i];
    if (
      !isObject(item) ||
      typeof item.id !== "string" ||
      typeof item.label !== "string"
    ) {
      throw new SpecError(`${path}[${i}] must have id and label`);
    }
  }
}

function validateAction(value: unknown, path: string): void {
  if (!isObject(value)) {
    throw new SpecError(`${path} must be an object`);
  }
  if (typeof value.id !== "string" || value.id.length === 0) {
    throw new SpecError(`${path}.id must be a non-empty string`);
  }
  if (typeof value.label !== "string" || value.label.length === 0) {
    throw new SpecError(`${path}.label must be a non-empty string`);
  }
  if (
    value.selection !== undefined &&
    value.selection !== "selected" &&
    value.selection !== "query"
  ) {
    throw new SpecError(`${path}.selection must be "selected" or "query"`);
  }
  if (
    value.allowedWhen !== undefined &&
    typeof value.allowedWhen !== "string"
  ) {
    throw new SpecError(`${path}.allowedWhen must be a string`);
  }
  if (
    typeof value.allowedWhen === "string" &&
    !isExpressionSyntaxValid(value.allowedWhen)
  ) {
    throw new SpecError(`${path}.allowedWhen has invalid expression syntax`);
  }
  if (
    value.confirm !== undefined &&
    value.confirm !== true &&
    typeof value.confirm !== "string"
  ) {
    throw new SpecError(`${path}.confirm must be true or a string`);
  }
  if (value.ui !== undefined && !isObject(value.ui)) {
    throw new SpecError(`${path}.ui must be an object`);
  }
  if (value.dialog !== undefined) {
    validateDialog(value.dialog, `${path}.dialog`);
  }
  if (value.api !== undefined) {
    validateApi(value.api, `${path}.api`);
  }
}

function validateDialog(value: unknown, path: string): void {
  if (!isObject(value)) {
    throw new SpecError(`${path} must be an object`);
  }
  if (!Array.isArray(value.fields)) {
    throw new SpecError(`${path}.fields must be an array`);
  }
  for (let i = 0; i < value.fields.length; i += 1) {
    const field = value.fields[i];
    if (!isObject(field) || typeof field.name !== "string") {
      throw new SpecError(`${path}.fields[${i}] must have name`);
    }
    if (field.validation !== undefined) {
      validateFieldValidation(
        field.validation,
        `${path}.fields[${i}].validation`,
      );
    }
  }
}

function validateApi(value: unknown, path: string): void {
  if (!isObject(value)) {
    throw new SpecError(`${path} must be an object`);
  }
  if (typeof value.path !== "string" || value.path.length === 0) {
    throw new SpecError(`${path}.path must be a non-empty string`);
  }
  const method = value.method;
  if (
    method !== undefined &&
    method !== "GET" &&
    method !== "POST" &&
    method !== "PUT" &&
    method !== "PATCH" &&
    method !== "DELETE"
  ) {
    throw new SpecError(`${path}.method must be GET|POST|PUT|PATCH|DELETE`);
  }
  if (value.body !== undefined && !isStringArray(value.body)) {
    throw new SpecError(`${path}.body must be string[]`);
  }
}
