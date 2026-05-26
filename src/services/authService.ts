import { apiService } from './apiService'

class AuthService {
  login = (body: { code: string; password: string }) => {
    return apiService.post<{ token: string }>('/signin', body, {
      withAuth: false,
      dryRun: false,
    })
  }

  sendRecoveryMail = (body: { code: string }) => {
    return apiService.post<{ message: string }>("/recovery_password", body, {
      withAuth: false,
      dryRun: false
    })
  }

  changeUserPassword = (body: { code: string, recovery_code: string, new_password: string }) => {
    return apiService.put<{ message: string }>("/recovery_password", body, {
      withAuth: false,
      dryRun: false
    })
  }
}

export const authService = new AuthService()
