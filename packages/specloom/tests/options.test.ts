import { describe, expect, it } from "vitest";
import userSpec from "./fixtures/user-spec.json";
import {
  createOptionsResolver,
  validateSpec,
  type CompiledField,
} from "../src/index.js";

describe("options resolver", () => {
  it("resolves static options", async () => {
    const resolver = createOptionsResolver({
      spec: validateSpec(structuredClone(userSpec)),
    });
    const field: CompiledField = {
      name: "status",
      type: {
        kind: "enum",
        name: "Status",
        nullable: true,
        array: false,
      },
      ui: {
        label: "Status",
        visibleIn: { list: false, show: false, form: true },
      },
      options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ],
      submit: {
        field: "status",
        shape: "self",
      },
    };

    const resolved = await resolver.resolve({ field });

    expect(resolved.items).toEqual([
      { value: "draft", label: "Draft", raw: { value: "draft", label: "Draft" } },
      {
        value: "published",
        label: "Published",
        raw: { value: "published", label: "Published" },
      },
    ]);
  });

  it("resolves optionsSource and relation lookup via fetcher", async () => {
    const spec = validateSpec(structuredClone(userSpec));
    spec.resources.User.fields.departmentId.optionsSource = {
      resource: "Department",
      labelField: "name",
      valueField: "id",
      searchFields: ["name"],
    };

    const fetcher = async () => [
      { id: "dep-1", name: "HR" },
      { id: "dep-2", name: "Engineering" },
    ];

    const resolver = createOptionsResolver({ spec, fetcher });
    const resolved = await resolver.resolve({
      field: spec.resources.User.fields.departmentId,
      query: "hr",
    });

    expect(resolved.searchable).toBe(true);
    expect(resolved.items[0]).toMatchObject({
      value: "dep-1",
      label: "HR",
    });
  });
});
