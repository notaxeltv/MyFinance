import { z } from "zod"

import { ACCOUNT_TYPES } from "@/types/account"
import { CATEGORY_TYPES } from "@/types/category"

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

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Il nome deve contenere almeno 2 caratteri.")
    .max(60, "Il nome è troppo lungo."),
  defaultCurrency: z.enum(["EUR", "USD", "GBP", "CHF"]),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const accountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Il nome del conto è obbligatorio.")
    .max(60, "Il nome è troppo lungo."),
  type: z
    .string()
    .refine((value) => (ACCOUNT_TYPES as string[]).includes(value), {
      message: "Tipo di conto non valido.",
    }),
  currency: z.string().trim().length(3, "Usa il codice valuta a 3 lettere (es. EUR)."),
  initialBalance: z
    .number({ message: "Inserisci un importo valido." })
    .finite("Inserisci un importo valido."),
  color: z.string().min(1, "Scegli un colore."),
  icon: z.string().min(1, "Scegli un'icona."),
})

export type AccountFormValues = z.infer<typeof accountSchema>

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Il nome della categoria è obbligatorio.")
    .max(60, "Il nome è troppo lungo."),
  type: z
    .string()
    .refine((value) => (CATEGORY_TYPES as string[]).includes(value), {
      message: "Tipo di categoria non valido.",
    }),
  color: z.string().min(1, "Scegli un colore."),
  icon: z.string().min(1, "Scegli un'icona."),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
