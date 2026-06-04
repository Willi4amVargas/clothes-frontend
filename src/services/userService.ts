export interface User {
    code: string
    description: string
    email: string
    exp: number
    iat: number
    id: number
    profile: number
    recovery_token: string
    recovery_token_expires_at: string
    status: boolean
}

class UserService {
    constructor(private USER_DATA_KEY: string = "user_data") { }
    getToken = (): User | null => {
        const userData = localStorage.getItem(this.USER_DATA_KEY)
        if (!userData) {
            return null
        }
        // @ts-ignore with setToken method we verify this token is a valid json and have a User interface form
        return JSON.parse(userData)
    }
    setToken = (data: User) => {
        localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(data))
    }
    clearToken = () => {
        localStorage.removeItem(this.USER_DATA_KEY)
    }
}

export const userService = new UserService()