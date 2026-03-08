import { describe, expect, it } from "vitest";
import { buildActionRequest, interpolateActionPath } from "../src/index.js";

describe("action helpers", () => {
  it("interpolates action paths", () => {
    expect(
      interpolateActionPath("/users/{id}/members/{team.id}", {
        id: "user-1",
        team: { id: "team-2" },
      }),
    ).toBe("/users/user-1/members/team-2");
  });

  it("builds request descriptors from action metadata", () => {
    const descriptor = buildActionRequest({
      action: {
        id: "suspend",
        kind: "row",
        view: "list",
        resource: "User",
        label: "Suspend",
        visible: true,
        disabled: false,
        allowed: true,
        selection: "selected",
        operation: {
          id: "suspend",
          method: "POST",
          path: "/users/{id}/suspend",
        },
      },
      record: { id: "user-1" },
      selected: ["user-1"],
      input: { reason: "policy" },
    });

    expect(descriptor).toEqual({
      id: "suspend",
      method: "POST",
      path: "/users/user-1/suspend",
      selection: "selected",
      input: { reason: "policy" },
      selected: ["user-1"],
    });
  });
});
