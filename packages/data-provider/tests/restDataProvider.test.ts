import { describe, expect, it, vi } from "vitest";

import { createRestDataProvider } from "../src/providers/rest/restDataProvider.js";
import type { HttpClient } from "../src/http/httpClient.js";

function createHttpStub(): HttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
}

describe("createRestDataProvider", () => {
  it("builds list queries from resource config", async () => {
    const http = createHttpStub();
    vi.mocked(http.get).mockResolvedValue({
      data: [{ id: 1, display_name: "Alice" }],
      total: 1,
    });

    const provider = createRestDataProvider(http, {
      resources: {
        users: {
          endpoint: "/v1/users",
          defaultFilter: { active: true },
          transformFilter: (filter) => ({
            active: filter.active,
            role: String(filter.role).toUpperCase(),
          }),
          transformSort: (field) => `api_${field}`,
          transformResponse: (raw) => {
            const item = raw as { id: number; display_name: string };
            return { id: item.id, name: item.display_name };
          },
        },
      },
    });

    const result = await provider.getList("users", {
      pagination: { page: 2, perPage: 25 },
      sort: { field: "name", order: "desc" },
      filter: { role: "admin" },
    });

    expect(http.get).toHaveBeenCalledWith(
      "/v1/users?_page=2&_limit=25&_sort=api_name&_order=desc&active=true&role=ADMIN",
    );
    expect(result).toEqual({
      data: [{ id: 1, name: "Alice" }],
      total: 1,
    });
  });

  it("executes custom actions with request and response transforms", async () => {
    const http = createHttpStub();
    vi.mocked(http.post).mockResolvedValue({ ok: true, task_id: "task-1" });

    const provider = createRestDataProvider(http, {
      resources: {
        users: {
          actions: {
            archive: {
              method: "POST",
              path: (id) => `/users/${id}/archive`,
              transformRequest: (data) => ({
                reason_code: (data as { reason: string }).reason,
              }),
              transformResponse: (raw) => ({
                ok: (raw as { ok: boolean }).ok,
                taskId: (raw as { task_id: string }).task_id,
              }),
            },
          },
        },
      },
    });

    const result = await provider.action("users", "archive", 7, {
      reason: "duplicate",
    });

    expect(http.post).toHaveBeenCalledWith("/users/7/archive", {
      reason_code: "duplicate",
    });
    expect(result).toEqual({ ok: true, taskId: "task-1" });
  });
});
