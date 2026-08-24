const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Variabili d'ambiente Supabase mancanti. Copia '.env.example' in '.env.local' e imposta VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
  )
}

export const env = {
  supabaseUrl: supabaseUrl ?? "",
  supabaseAnonKey: supabaseAnonKey ?? "",
  defaultCurrency: (import.meta.env.VITE_DEFAULT_CURRENCY as string) || "EUR",
} as const
