import { tokenStorage } from "@/shared/lib/token";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  dryRun?: boolean;
  withAuth?: boolean;
  headers?: HeadersInit;
};

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = import.meta.env.VITE_API_URL ?? "") {
    this.baseUrl = baseUrl;
  }

  public get<TResponse>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<TResponse>(path, { ...options, method: "GET" });
  }

  public post<TResponse>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<TResponse>(path, { ...options, method: "POST", body });
  }

  private async request<TResponse>(
    path: string,
    options: RequestOptions,
  ): Promise<TResponse> {
    const method = options.method ?? "GET";
    const dryRun = options.dryRun ?? true;
    const withAuth = options.withAuth ?? true;
    const url = dryRun
      ? this.withQuery(path, { dry_run: String(dryRun) })
      : path;
    const headers = new Headers(options.headers);

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (withAuth) {
      const token = tokenStorage.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    if (response.status === 401) {
      tokenStorage.clearToken();
      //   window.location.assign('/login')
      throw new Error("Unauthorized");
    }

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        typeof responseBody === "object" &&
        responseBody !== null &&
        "message" in responseBody &&
        typeof responseBody.message === "string"
          ? responseBody.message
          : "Request failed";

      throw new Error(message);
    }

    return responseBody as TResponse;
  }

  private withQuery(path: string, query: Record<string, string>) {
    const url = new URL(path, import.meta.env.VITE_API_URL);
    Object.entries(query).forEach(([key, value]) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });
    return `${url.pathname}${url.search}`;
  }
}

export const apiClient = new ApiClient();
