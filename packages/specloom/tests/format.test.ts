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
          field: "amount",
          label: "Amount",
          sortable: true,
          fieldSpec: field,
        },
        { amount: 1200 },
        { locale: "ja-JP" },
      ),
    ).toBe("￥1,200");
  });
});
