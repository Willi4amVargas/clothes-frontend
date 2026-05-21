import z from "zod";

export const recoveryUserSchema = z.object({
  code: z.string().min(1, "User code is required"),
});

export const recoveryUserPasswordSchema = z.object({
  code: z.string().min(1, "User code is required"),
  recovery_code: z.string().min(1, "Recovery code is required"),
  new_password: z.string().min(1, "New password is required"),
});

export type RecoveryUser = z.infer<typeof recoveryUserSchema>;
export type RecoveryUserPassword = z.infer<typeof recoveryUserPasswordSchema>;
