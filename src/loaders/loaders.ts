import { tokenService } from '#/services/tokenService'
import { redirect } from '@tanstack/react-router'

export function protectedLoader() {
  const token = tokenService.getToken()
  if (!token) {
    throw redirect({ to: '/login' })
  }
}
