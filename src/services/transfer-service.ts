import { supabase } from "@/lib/supabase"

export interface CreateTransferInput {
  user_id: string
  from_account_id: string
  to_account_id: string
  amount: number
  transfer_date: string
  description?: string | null
}

export async function createTransfer(input: CreateTransferInput) {
  const { data, error } = await supabase
    .from("transfers")
    .insert(input)
    .select("*")
    .single()

  if (error) throw error
  return data
}
