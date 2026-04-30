const AUTH_TOKEN_KEY = 'auth_token'

export const tokenStorage = {
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },
  setToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  },
  clearToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  },
}
