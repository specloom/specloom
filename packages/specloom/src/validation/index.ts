import type { CompiledField, CompiledInput, CompiledResource, CompiledRule } from "@specloom/spec";
import { buildEnvironment, evaluateExpression } from "../expression/index.js";
import { getField } from "../resolver/index.js";
import type { Context, ValidationErrors } from "../vm/types.js";

export type ValidationMode = "create" | "edit";
export type ValidationView = "list" | "show" | "form";

export interface FieldRuntimeState {
  visible: boolean;
  required: boolean;
  readonly: boolean;
  disabled: boolean;
}

export interface ResolveFieldStateArgs {
  field: CompiledField;
  context?: Context;
  values?: Record<string, unknown>;
  mode?: ValidationMode;
  view?: ValidationView;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrors;
  formErrors: string[];
  fieldStates: Record<string, FieldRuntimeState>;
}

export interface ValidateFormArgs {
  resource: CompiledResource | CompiledInput;
  values?: Record<string, unknown>;
  context?: Context;
  mode?: ValidationMode;
}

export interface ValidateFieldArgs extends ValidateFormArgs {
  fieldName: string;
}

export function resolveFieldState(
  args: ResolveFieldStateArgs,
): FieldRuntimeState {
  const {
    field,
    context = {},
    values = {},
    mode = "create",
    view = "form",
  } = args;

  return {
    visible: isFieldVisible(field, view, context, values),
    required:
      isFieldRequiredByType(field) ||
      evaluateExpression(field.rules?.requiredWhen, context, values, false),
    readonly:
      field.ui.readonly === true ||
      field.computed === true ||
      (mode === "edit" && field.createOnly === true) ||
      evaluateExpression(field.rules?.readonlyWhen, context, values, false),
    disabled: evaluateExpression(
      field.rules?.disabledWhen,
      context,
      values,
      false,
    ),
  };
}

export function validateField(args: ValidateFieldArgs): string[] {
  const {
    resource,
    fieldName,
    values = {},
    context = {},
    mode = "create",
  } = args;
  const field = getField(resource, fieldName);
  const effectiveValues = toEffectiveValues(resource, values);

  return validateResolvedField({
    field,
    resource,
    value: effectiveValues[fieldName],
    values: effectiveValues,
    context,
    mode,
  });
}

export function validateForm(args: ValidateFormArgs): ValidationResult {
  const {
    resource,
    values = {},
    context = {},
    mode = "create",
  } = args;
  const effectiveValues = toEffectiveValues(resource, values);
  const errors: ValidationErrors = {};
  const fieldStates: Record<string, FieldRuntimeState> = {};
  const formErrors: string[] = [];

  for (const field of Object.values(resource.fields)) {
    fieldStates[field.name] = resolveFieldState({
      field,
      context,
      values: effectiveValues,
      mode,
      view: "form",
    });

    const fieldErrors = validateResolvedField({
      field,
      resource,
      value: effectiveValues[field.name],
      values: effectiveValues,
      context,
      mode,
    });

    if (fieldErrors.length > 0) {
      errors[field.name] = fieldErrors;
    }
  }

  for (const rule of resource.rules ?? []) {
    applyRuleValidation({
      rule,
      resource,
      values: effectiveValues,
      context,
      errors,
      formErrors,
    });
  }

  return {
    valid: Object.keys(errors).length === 0 && formErrors.length === 0,
    errors,
    formErrors,
    fieldStates,
  };
}

interface ValidateResolvedFieldArgs {
  field: CompiledField;
  resource: CompiledResource | CompiledInput;
  value: unknown;
  values: Record<string, unknown>;
  context: Context;
  mode: ValidationMode;
}

function validateResolvedField(args: ValidateResolvedFieldArgs): string[] {
  const { field, resource, value, values, context, mode } = args;
  const state = resolveFieldState({
    field,
    context,
    values,
    mode,
    view: "form",
  });

  if (!state.visible || state.disabled || state.readonly) {
    return [];
  }

  const errors: string[] = [];
  const label = field.ui.label ?? field.name;
  const validation = field.validation;

  if (state.required && isEmpty(value)) {
    errors.push(`${label} is required`);
    return errors;
  }

  if (isEmpty(value) && !Array.isArray(value)) {
    return errors;
  }

  const numericValue = toNumber(value);
  if (numericValue !== undefined) {
    if (
      validation?.minValue != null &&
      numericValue < validation.minValue
    ) {
      errors.push(`Must be greater than or equal to ${validation.minValue}`);
    }

    if (
      validation?.maxValue != null &&
      numericValue > validation.maxValue
    ) {
      errors.push(`Must be less than or equal to ${validation.maxValue}`);
    }
  }

  if (typeof value === "string") {
    if (
      validation?.minLength != null &&
      value.length < validation.minLength
    ) {
      errors.push(`Must be at least ${validation.minLength} characters`);
    }

    if (
      validation?.maxLength != null &&
      value.length > validation.maxLength
    ) {
      errors.push(`Must be at most ${validation.maxLength} characters`);
    }

    if (validation?.pattern != null) {
      const patternError = validatePattern(value, validation.pattern);
      if (patternError) {
        errors.push(patternError);
      }
    }
  }

  if (Array.isArray(value)) {
    if (validation?.minItems != null && value.length < validation.minItems) {
      errors.push(`Select at least ${validation.minItems} items`);
    }

    if (validation?.maxItems != null && value.length > validation.maxItems) {
      errors.push(`Select at most ${validation.maxItems} items`);
    }
  }

  if (validation?.match) {
    const otherValue = values[validation.match];
    if (otherValue !== undefined && value !== otherValue) {
      const otherLabel =
        resource.fields[validation.match]?.ui.label ?? validation.match;
      errors.push(`Must match ${otherLabel}`);
    }
  }

  return errors;
}

function applyRuleValidation(args: {
  rule: CompiledRule;
  resource: CompiledResource | CompiledInput;
  values: Record<string, unknown>;
  context: Context;
  errors: ValidationErrors;
  formErrors: string[];
}): void {
  const { rule, resource, values, context, errors, formErrors } = args;

  if (rule.when && !evaluateExpression(rule.when, context, values, false)) {
    return;
  }

  switch (rule.kind) {
    case "requireOneOf":
      validateRequireOneOf(rule, resource, values, errors, formErrors);
      return;
    case "comparison":
      validateComparison(rule, values, context, formErrors);
      return;
    case "requiredIf":
      validateRequiredIf(rule, resource, values, errors);
      return;
    case "mutuallyExclusive":
      validateMutuallyExclusive(rule, values, errors, formErrors);
      return;
    case "requiredTogether":
      validateRequiredTogether(rule, values, errors, formErrors);
      return;
  }
}

function validateRequireOneOf(
  rule: CompiledRule,
  resource: CompiledResource | CompiledInput,
  values: Record<string, unknown>,
  errors: ValidationErrors,
  formErrors: string[],
): void {
  const fields = rule.fields ?? [];
  if (fields.some((field) => !isEmpty(values[field]))) {
    return;
  }

  const message =
    rule.message ?? `At least one of ${fields.join(", ")} is required`;
  pushFormError(formErrors, message);
  for (const field of fields) {
    const label = resource.fields[field]?.ui.label ?? field;
    pushFieldError(errors, field, rule.message ?? `${label} is required`);
  }
}

function validateComparison(
  rule: CompiledRule,
  values: Record<string, unknown>,
  context: Context,
  formErrors: string[],
): void {
  if (!rule.left || !rule.right || !rule.operator) {
    return;
  }

  const env = buildEnvironment(context, values);
  const left = resolvePath(env, rule.left);
  const right = resolvePath(env, rule.right);

  if (!compareValues(left, right, rule.operator)) {
    pushFormError(
      formErrors,
      rule.message ?? `${rule.left} must be ${rule.operator} ${rule.right}`,
    );
  }
}

function validateRequiredIf(
  rule: CompiledRule,
  resource: CompiledResource | CompiledInput,
  values: Record<string, unknown>,
  errors: ValidationErrors,
): void {
  if (!rule.field || isEmpty(values[rule.field])) {
    if (rule.field) {
      const label = resource.fields[rule.field]?.ui.label ?? rule.field;
      pushFieldError(errors, rule.field, rule.message ?? `${label} is required`);
    }
  }
}

function validateMutuallyExclusive(
  rule: CompiledRule,
  values: Record<string, unknown>,
  errors: ValidationErrors,
  formErrors: string[],
): void {
  const populated = (rule.fields ?? []).filter((field) => !isEmpty(values[field]));
  if (populated.length <= 1) {
    return;
  }

  const message =
    rule.message ?? `${populated.join(", ")} cannot be provided together`;
  pushFormError(formErrors, message);
  for (const field of populated) {
    pushFieldError(errors, field, message);
  }
}

function validateRequiredTogether(
  rule: CompiledRule,
  values: Record<string, unknown>,
  errors: ValidationErrors,
  formErrors: string[],
): void {
  const fields = rule.fields ?? [];
  const populated = fields.filter((field) => !isEmpty(values[field]));
  if (populated.length === 0 || populated.length === fields.length) {
    return;
  }

  const missing = fields.filter((field) => isEmpty(values[field]));
  const message =
    rule.message ?? `These fields must be provided together: ${fields.join(", ")}`;
  pushFormError(formErrors, message);
  for (const field of missing) {
    pushFieldError(errors, field, message);
  }
}

function validatePattern(value: string, pattern: string): string | null {
  switch (pattern) {
    case "email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : "Invalid email address";
    }
    case "url": {
      try {
        new URL(value);
        return null;
      } catch {
        return "Invalid URL";
      }
    }
    case "tel": {
      const telRegex = /^[\d\-+()]+$/;
      return telRegex.test(value) ? null : "Invalid telephone number";
    }
    default: {
      try {
        const regex = new RegExp(pattern);
        return regex.test(value) ? null : "Invalid format";
      } catch {
        return null;
      }
    }
  }
}

function toEffectiveValues(
  resource: CompiledResource | CompiledInput,
  values: Record<string, unknown>,
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...values };

  for (const field of Object.values(resource.fields)) {
    next[field.name] = values[field.name] ?? field.ui.defaultValue;
  }

  return next;
}

function isFieldVisible(
  field: CompiledField,
  view: ValidationView,
  context: Context,
  values: Record<string, unknown>,
): boolean {
  if (field.hidden === true) {
    return false;
  }

  if (!field.ui.visibleIn[view]) {
    return false;
  }

  return evaluateExpression(field.rules?.visibleWhen, context, values, true);
}

function isFieldRequiredByType(field: CompiledField): boolean {
  switch (field.type.kind) {
    case "scalar":
    case "enum":
      return field.type.nullable !== true && field.type.array !== true;
    case "relation":
    case "nested":
      return field.type.cardinality === "one";
  }
}

function isEmpty(value: unknown): boolean {
  if (typeof value === "boolean") {
    return false;
  }

  if (value == null || value === "") {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function compareValues(left: unknown, right: unknown, operator: string): boolean {
  switch (operator) {
    case "==":
      return left === right;
    case "!=":
      return left !== right;
    case ">":
      return compareOrdered(left, right, (a, b) => a > b);
    case ">=":
      return compareOrdered(left, right, (a, b) => a >= b);
    case "<":
      return compareOrdered(left, right, (a, b) => a < b);
    case "<=":
      return compareOrdered(left, right, (a, b) => a <= b);
    default:
      return false;
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

function pushFieldError(
  errors: ValidationErrors,
  fieldName: string,
  message: string,
): void {
  const existing = errors[fieldName] ?? [];
  if (!existing.includes(message)) {
    errors[fieldName] = [...existing, message];
  }
}

function pushFormError(formErrors: string[], message: string): void {
  if (!formErrors.includes(message)) {
    formErrors.push(message);
  }
}
