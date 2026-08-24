/**
 * Punto di accesso "storico" al client Supabase, mantenuto per coerenza con
 * la convenzione `src/integrations/<provider>`. L'istanza reale del client
 * vive in `@/lib/supabase` per rispettare la struttura file richiesta dal
 * progetto.
 */
export { supabase } from "@/lib/supabase"
