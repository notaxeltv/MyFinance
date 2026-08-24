import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/lib/query-keys"
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/services/category-service"
import type { CategoryInsert, CategoryUpdate } from "@/types"

export function useCategoriesQuery() {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery({
    queryKey: queryKeys.categories(userId ?? ""),
    queryFn: () => fetchCategories(userId!),
    enabled: Boolean(userId),
  })
}

export function useCreateCategoryMutation() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Omit<CategoryInsert, "user_id">) =>
      createCategory({ ...input, user_id: userId! }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.categories(userId ?? ""),
      })
      toast.success("Categoria creata")
    },
    onError: (error: Error) => {
      toast.error("Impossibile creare la categoria", {
        description: error.message,
      })
    },
  })
}

export function useUpdateCategoryMutation() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CategoryUpdate }) =>
      updateCategory(id, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.categories(userId ?? ""),
      })
      toast.success("Categoria aggiornata")
    },
    onError: (error: Error) => {
      toast.error("Impossibile aggiornare la categoria", {
        description: error.message,
      })
    },
  })
}

export function useDeleteCategoryMutation() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.categories(userId ?? ""),
      })
      toast.success("Categoria eliminata")
    },
    onError: (error: Error) => {
      toast.error("Impossibile eliminare la categoria", {
        description: error.message,
      })
    },
  })
}
