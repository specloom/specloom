export interface TokenProvider {
  getToken(): Promise<string | null>;
  checkError?(error: { message: string; status: number }): Promise<void>;
}

export interface HttpClient {
  get: <T>(path: string) => Promise<T>;
  post: <T>(path: string, body: unknown) => Promise<T>;
  put: <T>(path: string, body: unknown) => Promise<T>;
  delete: <T>(path: string) => Promise<T>;
}

export interface HttpClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export function createHttpClient(
  tokenProvider: TokenProvider,
  config: HttpClientConfig,
): HttpClient {
  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await tokenProvider.getToken();
    if (!token) throw { message: "Not authenticated", status: 401 };

    const res = await fetch(`${config.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...config.defaultHeaders,
        ...(options.headers as Record<string, string>),
      },
    });

    if (!res.ok) {
      const error = { message: await res.text(), status: res.status };
      await tokenProvider.checkError?.(error).catch(() => {});
      throw error;
    }
    return res.json() as Promise<T>;
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
      request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) =>
      request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  };
}
