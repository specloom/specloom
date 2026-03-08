import type { CompiledField, CompiledInput, CompiledResource } from "@specloom/spec";
import { getField } from "../resolver/index.js";

export interface NormalizeInputArgs {
  field: CompiledField;
  rawValue: unknown;
}

export interface UpdateFieldValueArgs {
  resource: CompiledResource | CompiledInput;
  values: Record<string, unknown>;
  fieldName: string;
  rawValue: unknown;
}

export function normalizeInputValue(args: NormalizeInputArgs): unknown {
  const { field, rawValue } = args;

  switch (field.type.kind) {
    case "scalar":
      return field.type.array
        ? normalizeArrayValue(field, rawValue)
        : normalizeScalarValue(field.type.name, rawValue);
    case "enum":
      return field.type.array
        ? normalizeArrayValue(field, rawValue)
        : normalizeEnumValue(rawValue);
    case "relation":
      return normalizeRelationValue(field, rawValue);
    case "nested":
      return normalizeNestedValue(field, rawValue);
  }
}

export function updateFieldValue(args: UpdateFieldValueArgs): Record<string, unknown> {
  const { resource, values, fieldName, rawValue } = args;
  const field = getField(resource, fieldName);

  return {
    ...values,
    [fieldName]: normalizeInputValue({
      field,
      rawValue,
    }),
  };
}

export function addNestedItem(args: {
  values: Record<string, unknown>;
  field: CompiledField;
  item?: Record<string, unknown>;
}): Record<string, unknown> {
  const { values, field, item = {} } = args;
  if (field.type.kind !== "nested") {
    return values;
  }

  if (field.type.cardinality === "one") {
    return {
      ...values,
      [field.name]: item,
    };
  }

  const current = Array.isArray(values[field.name]) ? [...(values[field.name] as unknown[])] : [];
  current.push(item);

  return {
    ...values,
    [field.name]: current,
  };
}

export function updateNestedItem(args: {
  values: Record<string, unknown>;
  field: CompiledField;
  index: number;
  patch: Record<string, unknown>;
}): Record<string, unknown> {
  const { values, field, index, patch } = args;
  if (field.type.kind !== "nested") {
    return values;
  }

  if (field.type.cardinality === "one") {
    return {
      ...values,
      [field.name]: {
        ...toRecord(values[field.name]),
        ...patch,
      },
    };
  }

  const current = Array.isArray(values[field.name]) ? [...(values[field.name] as unknown[])] : [];
  const existing = toRecord(current[index]);
  current[index] = {
    ...existing,
    ...patch,
  };

  return {
    ...values,
    [field.name]: current,
  };
}

export function removeNestedItem(args: {
  values: Record<string, unknown>;
  field: CompiledField;
  index: number;
}): Record<string, unknown> {
  const { values, field, index } = args;
  if (field.type.kind !== "nested") {
    return values;
  }

  if (field.type.cardinality === "one") {
    const next = { ...values };
    delete next[field.name];
    return next;
  }

  const current = Array.isArray(values[field.name]) ? [...(values[field.name] as unknown[])] : [];
  current.splice(index, 1);

  return {
    ...values,
    [field.name]: current,
  };
}

function normalizeArrayValue(field: CompiledField, rawValue: unknown): unknown[] {
  if (rawValue == null || rawValue === "") {
    return [];
  }

  const values = Array.isArray(rawValue) ? rawValue : [rawValue];
  return values.map((value) =>
    field.type.kind === "scalar"
      ? normalizeScalarValue(field.type.name, value)
      : normalizeEnumValue(value),
  );
}

function normalizeEnumValue(rawValue: unknown): unknown {
  return rawValue === "" ? undefined : rawValue;
}

function normalizeRelationValue(field: CompiledField, rawValue: unknown): unknown {
  if (field.type.kind !== "relation") {
    return rawValue;
  }

  if (field.type.cardinality === "many") {
    if (rawValue == null || rawValue === "") {
      return [];
    }
    return Array.isArray(rawValue) ? rawValue : [rawValue];
  }

  return rawValue === "" ? undefined : rawValue;
}

function normalizeNestedValue(field: CompiledField, rawValue: unknown): unknown {
  if (field.type.kind !== "nested") {
    return rawValue;
  }

  if (field.type.cardinality === "many") {
    if (rawValue == null || rawValue === "") {
      return [];
    }
    return Array.isArray(rawValue) ? rawValue : [rawValue];
  }

  return rawValue === "" ? undefined : rawValue;
}

function normalizeScalarValue(typeName: string, rawValue: unknown): unknown {
  if (rawValue === "") {
    return undefined;
  }
  if (rawValue == null) {
    return rawValue;
  }

  switch (typeName) {
    case "boolean":
      return normalizeBoolean(rawValue);
    case "int32":
    case "int64":
    case "float32":
    case "float64":
    case "number":
      return normalizeNumber(rawValue);
    case "date":
      return normalizeDate(rawValue, false);
    case "datetime":
    case "utcDateTime":
      return normalizeDate(rawValue, true);
    default:
      return rawValue;
  }
}

function normalizeBoolean(rawValue: unknown): boolean {
  if (typeof rawValue === "boolean") {
    return rawValue;
  }
  if (typeof rawValue === "number") {
    return rawValue !== 0;
  }
  if (typeof rawValue === "string") {
    const value = rawValue.trim().toLowerCase();
    return value === "true" || value === "1" || value === "on" || value === "yes";
  }
  return Boolean(rawValue);
}

function normalizeNumber(rawValue: unknown): unknown {
  if (typeof rawValue === "number") {
    return Number.isNaN(rawValue) ? undefined : rawValue;
  }
  if (typeof rawValue !== "string") {
    return rawValue;
  }

  const parsed = Number(rawValue);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function normalizeDate(rawValue: unknown, withTime: boolean): unknown {
  if (rawValue instanceof Date) {
    return withTime ? rawValue.toISOString() : rawValue.toISOString().slice(0, 10);
  }
  return rawValue;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
