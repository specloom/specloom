export interface HttpError {
  message: string;
  status: number;
}

export interface TokenProvider {
  getToken(): Promise<string | null>;
  checkError?(error: HttpError): Promise<void>;
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
    if (!token) throw { message: "Not authenticated", status: 401 } satisfies HttpError;

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
      let message = res.statusText;
      try {
        const body = await res.json();
        if (body && typeof body.error === "string") {
          message = body.error;
        }
      } catch {
        // JSON parse failed — try plain text
        try {
          message = await res.text();
        } catch {
          // keep statusText
        }
      }
      const error: HttpError = { message, status: res.status };
      await tokenProvider.checkError?.(error).catch(() => {});
      throw error;
    }
    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return undefined as T;
    }
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
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
