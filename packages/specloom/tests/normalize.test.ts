import { describe, expect, it } from "vitest";
import userSpec from "./fixtures/user-spec.json";
import {
  addNestedItem,
  normalizeInputValue,
  removeNestedItem,
  updateFieldValue,
  updateNestedItem,
  validateSpec,
  type CompiledField,
} from "../src/index.js";

describe("normalize", () => {
  it("normalizes number and boolean values", () => {
    const numberField: CompiledField = {
      name: "age",
      type: {
        kind: "scalar",
        name: "int32",
        nullable: true,
        array: false,
      },
      ui: {
        label: "Age",
        visibleIn: { list: false, show: false, form: true },
      },
      submit: {
        field: "age",
        shape: "self",
      },
    };

    const boolField: CompiledField = {
      name: "enabled",
      type: {
        kind: "scalar",
        name: "boolean",
        nullable: true,
        array: false,
      },
      ui: {
        label: "Enabled",
        visibleIn: { list: false, show: false, form: true },
      },
      submit: {
        field: "enabled",
        shape: "self",
      },
    };

    expect(
      normalizeInputValue({ field: numberField, rawValue: "42" }),
    ).toBe(42);
    expect(normalizeInputValue({ field: boolField, rawValue: "on" })).toBe(
      true,
    );
  });

  it("updates nested values immutably", () => {
    const spec = validateSpec(structuredClone(userSpec));
    const field = spec.resources.User.fields.addresses;

    let values: Record<string, unknown> = {};
    values = addNestedItem({
      values,
      field,
      item: { line1: "Tokyo" },
    });
    values = updateNestedItem({
      values,
      field,
      index: 0,
      patch: { postalCode: "100-0001" },
    });
    values = addNestedItem({
      values,
      field,
      item: { line1: "Osaka" },
    });
    values = removeNestedItem({
      values,
      field,
      index: 0,
    });

    expect(values.addresses).toEqual([{ line1: "Osaka" }]);
  });

  it("uses field metadata when updating a form value", () => {
    const spec = validateSpec(structuredClone(userSpec));
    spec.resources.User.fields.departmentId.type = {
      kind: "relation",
      resource: "Department",
      cardinality: "one",
      storage: "scalar",
    };

    const values = updateFieldValue({
      resource: spec.resources.User,
      values: {},
      fieldName: "departmentId",
      rawValue: "dep-1",
    });

    expect(values.departmentId).toBe("dep-1");
  });
});
