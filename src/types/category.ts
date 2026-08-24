import type {
  CategoryType,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/types"

export type Category = Tables<"categories">
export type CategoryInsert = TablesInsert<"categories">
export type CategoryUpdate = TablesUpdate<"categories">

export type { CategoryType }

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  income: "Entrata",
  expense: "Uscita",
  both: "Entrambe",
}

export const CATEGORY_TYPES = Object.keys(
  CATEGORY_TYPE_LABELS,
) as CategoryType[]
