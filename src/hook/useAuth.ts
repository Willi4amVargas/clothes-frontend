import { authService } from '#/services/authService'
import { tokenService } from '#/services/tokenService'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'

export const useAuth = () => {
  const navigate = useNavigate()
  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      tokenService.setToken(data.token)

      await navigate({ to: '/dashboard' })
    },
    onError: ({ message }) => {
      toast.error(`Error iniciando sesión: ${message}`, {
        toastId: "auth-error"
      })
    },
  })

  const logout = async () => {
    tokenService.clearToken()
    await navigate({
      to: '/login',
    })
  }

  const sendRecoveryMail = useMutation({
    mutationFn: authService.sendRecoveryMail,
    onSuccess: async (data, { code }) => {
      toast.success(data.message)
      await navigate({ to: '/recovery-password', search: { code } })
    },
    onError: async ({ message }) => {
      toast.error(message)
    }
  })

  const changeUserPassword = useMutation({
    mutationFn: authService.changeUserPassword,
    onSuccess: async (data) => {
      toast.success(data.message)
      await navigate({ to: "/login" })
    },
    onError: async ({ message }) => {
      toast.error(message)
    }
  })
  return { login, logout, sendRecoveryMail, changeUserPassword }
}
