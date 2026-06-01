class TokenService {
  constructor(private AUTH_TOKEN_KEY: string) {}
  getToken = () => {
    return localStorage.getItem(this.AUTH_TOKEN_KEY)
  }
  setToken = (token: string) => {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token)
  }
  clearToken = () => {
    localStorage.removeItem(this.AUTH_TOKEN_KEY)
  }
}

export const tokenService = new TokenService('auth_token')
