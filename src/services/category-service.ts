import { supabase } from "@/lib/supabase"
import type { Category, CategoryInsert, CategoryUpdate } from "@/types"

export async function fetchCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function createCategory(
  input: CategoryInsert,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select("*")
    .single()

  if (error) throw error
  return data
}

export async function updateCategory(
  id: string,
  updates: CategoryUpdate,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) throw error
}
