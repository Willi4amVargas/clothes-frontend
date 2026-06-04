import { apiService } from '#/services/apiService'
import { tokenService } from '#/services/tokenService'
import type { User } from '#/services/userService'
import { userService } from '#/services/userService'
import { redirect } from '@tanstack/react-router'


export async function protectedLoader() {
  const token = tokenService.getToken()
  if (!token) {
    throw redirect({ to: '/login' })
  }
  try {
    // in this case the server comprobe if the token his exp is valid or not
    const userData = await apiService.get<User>("/profile", {
      withAuth: true
    })
    userService.setToken(userData)

  } catch (error) {
    throw redirect({ to: '/login' })
  }
}
