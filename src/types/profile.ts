import type { Tables, TablesUpdate } from "@/integrations/supabase/types"

export type Profile = Tables<"profiles">
export type ProfileUpdate = TablesUpdate<"profiles">
