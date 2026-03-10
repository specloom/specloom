import { describe, expect, it } from "vitest";
import {
  applyNamedFilter,
  evaluateFilter,
  resolveFilterValue,
} from "../src/index.js";

describe("filter helpers", () => {
  it("evaluates compound filter expressions", () => {
    const record = { name: "Alice", status: "active", age: 20 };

    const passed = evaluateFilter({
      filter: {
        and: [
          { field: "status", operator: "eq", value: "active" },
          { field: "name", operator: "contains", value: "ali" },
          { field: "age", operator: "gte", value: 18 },
        ],
      },
      record,
    });

    expect(passed).toBe(true);
  });

  it("applies named filters and resolves context values", () => {
    const records = [
      { id: "1", ownerId: "user-1" },
      { id: "2", ownerId: "user-2" },
    ];

    const filtered = applyNamedFilter({
      data: records,
      namedFilter: {
        id: "mine",
        label: "Mine",
        conditions: {
          field: "ownerId",
          operator: "eq",
          value: { context: "user.id" },
        },
      },
      context: {
        user: { id: "user-1" },
      },
    });

    expect(filtered).toEqual([{ id: "1", ownerId: "user-1" }]);
    expect(
      resolveFilterValue({
        value: { relative: "-7d" },
        now: new Date("2026-03-08T00:00:00.000Z"),
      }),
    ).toBe("2026-03-01T00:00:00.000Z");
  });

  it("supports dotted paths and nested arrays in filter evaluation", () => {
    const record = {
      orderNumber: "SO-1",
      shippingAddress: { city: "Tokyo" },
      lineItems: [{ sku: "ABC-001" }, { sku: "XYZ-002" }],
    };

    expect(
      evaluateFilter({
        filter: {
          field: "shippingAddress.city",
          operator: "eq",
          value: "Tokyo",
        },
        record,
      }),
    ).toBe(true);

    expect(
      evaluateFilter({
        filter: {
          field: "lineItems.sku",
          operator: "contains",
          value: "XYZ",
        },
        record,
      }),
    ).toBe(true);
  });
});
