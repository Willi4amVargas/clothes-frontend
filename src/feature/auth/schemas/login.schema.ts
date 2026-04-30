import { z } from 'zod'

export const loginSchema = z.object({
  code: z.string().min(1, 'User code or email is required'),
  password: z.string().min(1, 'Password must have at least 1 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>
