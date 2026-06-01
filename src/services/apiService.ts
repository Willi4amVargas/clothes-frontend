import { tokenService } from './tokenService'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  dryRun?: boolean
  withAuth?: boolean
  headers?: HeadersInit
  stringify?: boolean
}

class APIService {
  private readonly baseUrl: string

  constructor(baseUrl = import.meta.env.VITE_API_URL ?? '') {
    this.baseUrl = baseUrl
  }

  public get<TResponse>(
    path: string,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) {
    return this.request<TResponse>(path, { ...options, method: 'GET' })
  }

  public post<TResponse>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) {
    return this.request<TResponse>(path, { ...options, method: 'POST', body })
  }

  public put<TResponse>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) {
    return this.request<TResponse>(path, { ...options, method: 'PUT', body })
  }

  public delete<TResponse>(
    path: string,
    body: unknown,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) {
    return this.request<TResponse>(path, {
      ...options,
      method: 'DELETE',
      body,
    })
  }

  private async request<TResponse>(
    path: string,
    {
      method = 'GET',
      stringify = true,
      dryRun = true,
      withAuth = true,
      ...options
    }: RequestOptions = {},
  ): Promise<TResponse> {
    const url = dryRun
      ? path
      : this.withQuery(path, { dry_run: String(dryRun) })
    const headers = new Headers(options.headers)

    if (stringify) {
      headers.set('Content-Type', 'application/json')
    }
    if (withAuth) {
      const token = tokenService.getToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      // @ts-ignore options.body trust the value works :D
      body: stringify ? JSON.stringify(options.body) : options.body,
    })

    if (response.status === 401) {
      tokenService.clearToken()
      throw new Error('Unauthorized')
    }

    const responseBody = await response.json()

    if (!response.ok) {
      const message =
        typeof responseBody === 'object' &&
          responseBody !== null &&
          'message' in responseBody &&
          typeof responseBody.message === 'string'
          ? responseBody.message
          : 'Request failed'

      throw new Error(message)
    }

    return responseBody as TResponse
  }

  private withQuery(path: string, query: Record<string, string>) {
    const url = new URL(path, this.baseUrl)
    Object.entries(query).forEach(([key, value]) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value)
      }
    })
    return `${url.pathname}${url.search}`
  }
}

export const apiService = new APIService()
