/**
 * Tipi generati manualmente a partire dallo schema SQL in
 * `supabase/migrations`. Quando lo schema cambia, aggiornare questo file
 * (idealmente con `supabase gen types typescript` una volta collegata la CLI
 * al progetto Supabase remoto).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AccountType =
  | "checking"
  | "savings"
  | "cash"
  | "credit_card"
  | "prepaid"
  | "digital_wallet"
  | "investment"
  | "other"

export type CategoryType = "income" | "expense" | "both"

export type TransactionType = "income" | "expense" | "transfer"

export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly"

export type PokemonProductType =
  | "booster_pack"
  | "booster_box"
  | "etb"
  | "collection_box"
  | "promo"
  | "single_card"
  | "graded_card"
  | "sealed_product"
  | "other"

export type PokemonStatus = "owned" | "sold" | "traded" | "opened" | "lost"

export type PokemonCondition =
  | "sealed"
  | "near_mint"
  | "played"
  | "graded"
  | "damaged"
  | "unknown"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          default_currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          default_currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          avatar_url?: string | null
          default_currency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: AccountType
          currency: string
          initial_balance: number
          current_balance: number
          color: string | null
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type?: AccountType
          currency?: string
          initial_balance?: number
          current_balance?: number
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: AccountType
          currency?: string
          initial_balance?: number
          current_balance?: number
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: CategoryType
          color: string | null
          icon: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type?: CategoryType
          color?: string | null
          icon?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: CategoryType
          color?: string | null
          icon?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          category_id: string | null
          type: TransactionType
          amount: number
          description: string
          frequency: RecurringFrequency
          next_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          category_id?: string | null
          type: TransactionType
          amount: number
          description: string
          frequency: RecurringFrequency
          next_date: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          category_id?: string | null
          type?: TransactionType
          amount?: number
          description?: string
          frequency?: RecurringFrequency
          next_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          category_id: string | null
          type: TransactionType
          amount: number
          description: string
          transaction_date: string
          payment_method: string | null
          notes: string | null
          is_recurring: boolean
          recurring_transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          category_id?: string | null
          type: TransactionType
          amount: number
          description: string
          transaction_date?: string
          payment_method?: string | null
          notes?: string | null
          is_recurring?: boolean
          recurring_transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          category_id?: string | null
          type?: TransactionType
          amount?: number
          description?: string
          transaction_date?: string
          payment_method?: string | null
          notes?: string | null
          is_recurring?: boolean
          recurring_transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transfers: {
        Row: {
          id: string
          user_id: string
          from_account_id: string
          to_account_id: string
          amount: number
          transfer_date: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          from_account_id: string
          to_account_id: string
          amount: number
          transfer_date?: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          from_account_id?: string
          to_account_id?: string
          amount?: number
          transfer_date?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          month: string
          amount: number
          alert_threshold: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          month: string
          amount: number
          alert_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          month?: string
          amount?: number
          alert_threshold?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          deadline: string | null
          color: string | null
          description: string | null
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          deadline?: string | null
          color?: string | null
          description?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          deadline?: string | null
          color?: string | null
          description?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pokemon_items: {
        Row: {
          id: string
          user_id: string
          name: string
          set_name: string | null
          product_type: PokemonProductType
          quantity: number
          purchase_price: number
          estimated_value: number | null
          purchase_date: string
          status: PokemonStatus
          condition: PokemonCondition
          seller: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          set_name?: string | null
          product_type?: PokemonProductType
          quantity?: number
          purchase_price: number
          estimated_value?: number | null
          purchase_date?: string
          status?: PokemonStatus
          condition?: PokemonCondition
          seller?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          set_name?: string | null
          product_type?: PokemonProductType
          quantity?: number
          purchase_price?: number
          estimated_value?: number | null
          purchase_date?: string
          status?: PokemonStatus
          condition?: PokemonCondition
          seller?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      recalculate_account_balance: {
        Args: { p_account_id: string }
        Returns: undefined
      }
    }
    Enums: {
      account_type: AccountType
      category_type: CategoryType
      transaction_type: TransactionType
      recurring_frequency: RecurringFrequency
      pokemon_product_type: PokemonProductType
      pokemon_status: PokemonStatus
      pokemon_condition: PokemonCondition
    }
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
