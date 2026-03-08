import { afterEach, describe, expect, it, vi } from "vitest";

import { createHttpClient } from "../src/http/httpClient.js";

describe("createHttpClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adds auth and default headers to requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = createHttpClient(
      {
        getToken: async () => "token-123",
      },
      {
        baseUrl: "https://api.example.com",
        defaultHeaders: { "X-App": "specloom" },
      },
    );

    const result = await client.post("/users", { name: "Alice" });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Alice" }),
        headers: expect.objectContaining({
          Authorization: "Bearer token-123",
          "Content-Type": "application/json",
          "X-App": "specloom",
        }),
      }),
    );
  });

  it("calls checkError and throws parsed API errors", async () => {
    const checkError = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Expired token" }), {
          status: 401,
          statusText: "Unauthorized",
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    const client = createHttpClient(
      {
        getToken: async () => "token-123",
        checkError,
      },
      { baseUrl: "https://api.example.com" },
    );

    await expect(client.get("/users")).rejects.toEqual({
      message: "Expired token",
      status: 401,
    });
    expect(checkError).toHaveBeenCalledWith({
      message: "Expired token",
      status: 401,
    });
  });
});
