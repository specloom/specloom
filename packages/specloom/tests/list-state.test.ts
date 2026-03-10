import { describe, expect, it } from "vitest";
import userSpec from "./fixtures/user-spec.json";
import { createListState, getResource, validateSpec } from "../src/index.js";

describe("list state", () => {
  it("tracks search, named filter, sort, and selection", () => {
    const spec = validateSpec(structuredClone(userSpec));
    spec.resources.User.views.list.namedFilters.push({
      id: "active",
      label: "Active",
      conditions: {
        field: "status",
        operator: "eq",
        value: "active",
      },
    });

    let list = createListState({
      resource: getResource(spec, "User"),
      data: [
        {
          id: "1",
          name: "Alice",
          email: "alice@example.com",
          status: "active",
        },
        { id: "2", name: "Bob", email: "bob@example.com", status: "inactive" },
      ],
    });

    list = list.setNamedFilter("active");
    list = list.setSearch("ali");
    list = list.setSort("name", "desc");
    list = list.toggleSelect("1");

    const vm = list.view();

    expect(vm.rows).toHaveLength(1);
    expect(vm.rows[0]?.id).toBe("1");
    expect(vm.selection.selected).toEqual(["1"]);
    expect(vm.currentSort).toEqual({ field: "name", direction: "desc" });
  });

  it("searches dotted paths and nested arrays with any-match semantics", () => {
    const spec = validateSpec(structuredClone(userSpec));
    spec.resources.User.views.list.search = {
      fields: ["department.name", "addresses.line1"],
    };

    const list = createListState({
      resource: getResource(spec, "User"),
      data: [
        {
          id: "1",
          name: "Alice",
          department: { name: "Engineering" },
          addresses: [{ line1: "Tokyo" }],
        },
        {
          id: "2",
          name: "Bob",
          department: { name: "Sales" },
          addresses: [{ line1: "Osaka" }, { line1: "Nagoya" }],
        },
      ],
      searchQuery: "nag",
    });

    const vm = list.view();

    expect(vm.rows).toHaveLength(1);
    expect(vm.rows[0]?.id).toBe("2");
  });
});
