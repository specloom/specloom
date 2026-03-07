import type {
  CompiledField,
  CompiledInput,
  CompiledResource,
} from "@specloom/spec";
import type { FormFieldVM, FormViewModel } from "../vm/types.js";

export interface SerializeOptions {
  excludeUndefined?: boolean;
  excludeNull?: boolean;
  excludeEmptyString?: boolean;
}

export function serializeForm(
  vm: FormViewModel,
  options: SerializeOptions = {},
): Record<string, unknown> {
  return serializeFields(vm.fields, options);
}

export function serializeResource(
  resource: CompiledResource,
  values: Record<string, unknown>,
  options: SerializeOptions = {},
): Record<string, unknown> {
  const fields = toSerializableSchemaFields(
    Object.values(resource.fields),
    values,
    true,
  );

  return serializeFields(fields, options);
}

export function serializeInput(
  input: CompiledInput,
  values: Record<string, unknown>,
  options: SerializeOptions = {},
): Record<string, unknown> {
  const fields = toSerializableSchemaFields(
    Object.values(input.fields),
    values,
    false,
  );

  return serializeFields(fields, options);
}

function serializeFields(
  fields: Array<Pick<FormFieldVM, "value" | "submit"> & { name: string }>,
  options: SerializeOptions,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    const value = serializeFieldValue(
      field as FormFieldVM | (CompiledField & { value: unknown }),
    );
    if (options.excludeUndefined && value === undefined) {
      continue;
    }
    if (options.excludeNull && value === null) {
      continue;
    }
    if (options.excludeEmptyString && value === "") {
      continue;
    }
    result[field.submit.field] = value;
  }

  return result;
}

function serializeFieldValue(
  field: Pick<FormFieldVM, "value" | "submit">,
): unknown {
  switch (field.submit.shape) {
    case "self":
      return field.value;
    case "scalar":
      return extractScalar(field.value, field.submit.valueField);
    case "scalar[]":
      return Array.isArray(field.value)
        ? field.value.map((value) =>
            extractScalar(value, field.submit.valueField),
          )
        : [];
    case "object":
      return field.value;
    case "object[]":
      return Array.isArray(field.value) ? field.value : [];
  }
}

function extractScalar(value: unknown, valueField?: string): unknown {
  if (!valueField) {
    return value;
  }
  if (typeof value !== "object" || value === null) {
    return value;
  }
  return (value as Record<string, unknown>)[valueField];
}

function toSerializableSchemaFields(
  fields: CompiledField[],
  values: Record<string, unknown>,
  applyFormVisibility: boolean,
): Array<Pick<FormFieldVM, "value" | "submit"> & { name: string }> {
  return fields
    .filter((field) => {
      if (field.computed) {
        return false;
      }

      if (!applyFormVisibility) {
        return true;
      }

      return field.ui.visibleIn.form;
    })
    .map((field) => ({
      name: field.name,
      submit: field.submit,
      value: values[field.name],
    }));
}
