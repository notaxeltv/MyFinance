import { supabase } from "@/lib/supabase"
import type { Account, AccountInsert, AccountUpdate } from "@/types"

export async function fetchAccounts(userId: string): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createAccount(input: AccountInsert): Promise<Account> {
  const { data, error } = await supabase
    .from("accounts")
    .insert(input)
    .select("*")
    .single()

  if (error) throw error
  return data
}

export async function updateAccount(
  id: string,
  updates: AccountUpdate,
): Promise<Account> {
  const { data, error } = await supabase
    .from("accounts")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return data
}

export async function setAccountActive(
  id: string,
  isActive: boolean,
): Promise<Account> {
  return updateAccount(id, { is_active: isActive })
}
