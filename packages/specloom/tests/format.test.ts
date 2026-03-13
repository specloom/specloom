import { describe, expect, it } from "vitest";
import userSpec from "./fixtures/user-spec.json";
import {
  formatColumnValue,
  formatTemplate,
  formatValue,
  validateSpec,
  type CompiledField,
} from "../src/index.js";

describe("format helpers", () => {
  it("formats templates, empty text, and relation labels", () => {
    const spec = validateSpec(structuredClone(userSpec));
    const relationField = spec.resources.User.fields.departmentId;
    relationField.ui.emptyText = "-";

    expect(formatTemplate("{name} <{email}>", { name: "Alice", email: "a@b.c" })).toBe(
      "Alice <a@b.c>",
    );
    expect(formatValue(relationField, { id: "dep-1", name: "HR" })).toBe("HR");
    expect(formatValue(relationField, undefined)).toBe("-");
  });

  it("formats currency and columns", () => {
    const field: CompiledField = {
      name: "amount",
      type: {
        kind: "scalar",
        name: "float64",
        nullable: true,
        array: false,
      },
      ui: {
        label: "Amount",
        format: "currency:JPY",
        visibleIn: { list: true, show: true, form: true },
      },
      submit: {
        field: "amount",
        shape: "self",
      },
    };

    expect(formatValue(field, 1200, { locale: "ja-JP" })).toBe("￥1,200");
    expect(
      formatColumnValue(
        {
          name: "amount",
          label: "Amount",
          kind: field.type,
          sortable: true,
          ui: field.ui,
          options: field.options,
          fieldSpec: field,
          columnSpec: { field: "amount", label: "Amount", sortable: true },
        },
        { amount: 1200 },
        { locale: "ja-JP" },
      ),
    ).toBe("￥1,200");
  });

  it("resolves option labels for select fields", () => {
    const field: CompiledField = {
      name: "priority",
      type: { kind: "scalar", name: "string", nullable: false, array: false },
      ui: { label: "Priority", widget: "select", visibleIn: { list: true, show: true, form: true } },
      options: [
        { value: "low", label: "低" },
        { value: "medium", label: "中" },
        { value: "high", label: "高" },
      ],
      submit: { field: "priority", shape: "self" },
    };

    expect(formatValue(field, "low")).toBe("低");
    expect(formatValue(field, "medium")).toBe("中");
    expect(formatValue(field, "high")).toBe("高");
    expect(formatValue(field, "unknown")).toBe("unknown");
  });
});
