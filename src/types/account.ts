import type {
  AccountType,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/types"

export type Account = Tables<"accounts">
export type AccountInsert = TablesInsert<"accounts">
export type AccountUpdate = TablesUpdate<"accounts">

export type { AccountType }

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  checking: "Conto corrente",
  savings: "Conto risparmio",
  cash: "Contanti",
  credit_card: "Carta di credito",
  prepaid: "Carta prepagata",
  digital_wallet: "Portafoglio digitale",
  investment: "Investimenti",
  other: "Altro",
}

export const ACCOUNT_TYPES = Object.keys(
  ACCOUNT_TYPE_LABELS,
) as AccountType[]
