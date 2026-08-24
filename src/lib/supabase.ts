import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/integrations/supabase/types"
import { env } from "@/lib/env"

export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
