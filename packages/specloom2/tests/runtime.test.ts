import userSpec from "./fixtures/user-spec.json";
import { describe, expect, it } from "vitest";
import {
  createAdmin,
  createFormVM,
  createListVM,
  serializeForm,
  validateSpec,
} from "../src/index.js";

const spec = validateSpec(userSpec);

describe("specloom2 runtime", () => {
  it("creates a list VM from a compiled spec", () => {
    const vm = createListVM(spec, "User", {
      context: { role: "admin" },
      data: [
        {
          id: "user-1",
          name: "Alice",
          email: "alice@example.com",
          departmentId: "dep-1",
          status: "active",
        },
      ],
      searchQuery: "alice",
    });

    expect(vm.columns.map((column) => column.field)).toEqual(["id", "name"]);
    expect(vm.pageActions[0]?.id).toBe("exportCsv");
    expect(vm.rows[0]?.actions[0]?.allowed).toBe(true);
    expect(vm.search.query).toBe("alice");
  });

  it("creates a form VM and serializes submit values", () => {
    const vm = createFormVM(spec, "User", {
      context: {},
      mode: "create",
    });

    expect(vm.sections.map((section) => section.id)).toEqual(["basic", "main"]);
    expect(vm.fields.find((field) => field.name === "name")?.required).toBe(
      true,
    );
    expect(serializeForm(vm)).toMatchObject({
      name: undefined,
      email: undefined,
      departmentId: undefined,
      addresses: [],
    });
  });

  it("creates an admin facade with default context", () => {
    const admin = createAdmin(spec, { role: "admin" });
    const vm = admin.list("User", {
      data: [
        {
          id: "user-1",
          name: "Alice",
          email: "alice@example.com",
          status: "inactive",
        },
      ],
    });

    expect(admin.hasResource("User")).toBe(true);
    expect(vm.rows[0]?.actions[0]?.allowed).toBe(false);
  });
});
