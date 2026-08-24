import type { Session, User } from "@supabase/supabase-js"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { supabase } from "@/lib/supabase"

interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data.session)
      setIsLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
        setIsLoading(false)
      },
    )

    return () => {
      isMounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        return { error: error ? mapAuthError(error.message) : null }
      },
      async signUp(email, password, displayName) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
          },
        })
        return { error: error ? mapAuthError(error.message) : null }
      },
      async signOut() {
        await supabase.auth.signOut()
      },
      async requestPasswordReset(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        return { error: error ? mapAuthError(error.message) : null }
      },
      async updatePassword(password) {
        const { error } = await supabase.auth.updateUser({ password })
        return { error: error ? mapAuthError(error.message) : null }
      },
    }),
    [session, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve essere usato all'interno di <AuthProvider>")
  }
  return context
}

function mapAuthError(message: string): string {
  const known: Record<string, string> = {
    "Invalid login credentials": "Email o password non corretti.",
    "User already registered": "Esiste già un account con questa email.",
    "Email not confirmed": "Devi confermare la tua email prima di accedere.",
    "Password should be at least 6 characters":
      "La password deve contenere almeno 6 caratteri.",
  }
  return known[message] ?? message
}
