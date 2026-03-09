import { describe, expect, it } from "vitest";
import userSpec from "./fixtures/user-spec.json";
import { createFormState, getResource, validateSpec } from "../src/index.js";

describe("form state", () => {
  it("supports setValue, validate, view, serialize, and reset", () => {
    const spec = validateSpec(structuredClone(userSpec));
    let form = createFormState({
      resource: getResource(spec, "User"),
      mode: "create",
      values: {
        email: "alice@example.com",
        departmentId: { id: "dep-1", name: "HR" },
      },
    });

    form = form.setValue("name", "Alice");

    const { state, result } = form.validate();
    const payload = state.serialize();

    expect(result.valid).toBe(true);
    expect(state.view().fields.find((field) => field.name === "name")?.value).toBe(
      "Alice",
    );
    expect(payload).toMatchObject({
      name: "Alice",
      email: "alice@example.com",
      departmentId: "dep-1",
      addresses: [],
    });

    const reset = state.reset();
    expect(reset.getValue("name")).toBeUndefined();
  });
});
