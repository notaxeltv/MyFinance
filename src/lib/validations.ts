import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().min(1, "L'email è obbligatoria.").email("Email non valida."),
  password: z.string().min(1, "La password è obbligatoria."),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, "Il nome deve contenere almeno 2 caratteri.")
      .max(60, "Il nome è troppo lungo."),
    email: z.string().trim().min(1, "L'email è obbligatoria.").email("Email non valida."),
    password: z
      .string()
      .min(6, "La password deve contenere almeno 6 caratteri."),
    confirmPassword: z.string().min(1, "Conferma la password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono.",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "L'email è obbligatoria.").email("Email non valida."),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La password deve contenere almeno 6 caratteri."),
    confirmPassword: z.string().min(1, "Conferma la password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Le password non coincidono.",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
