import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/lib/query-keys"
import {
  createAccount,
  fetchAccounts,
  setAccountActive,
  updateAccount,
} from "@/services/account-service"
import type { AccountInsert, AccountUpdate } from "@/types"

export function useAccountsQuery() {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery({
    queryKey: queryKeys.accounts(userId ?? ""),
    queryFn: () => fetchAccounts(userId!),
    enabled: Boolean(userId),
  })
}

export function useCreateAccountMutation() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Omit<AccountInsert, "user_id">) =>
      createAccount({ ...input, user_id: userId! }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.accounts(userId ?? ""),
      })
      toast.success("Conto creato")
    },
    onError: (error: Error) => {
      toast.error("Impossibile creare il conto", {
        description: error.message,
      })
    },
  })
}

export function useUpdateAccountMutation() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: AccountUpdate }) =>
      updateAccount(id, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.accounts(userId ?? ""),
      })
      toast.success("Conto aggiornato")
    },
    onError: (error: Error) => {
      toast.error("Impossibile aggiornare il conto", {
        description: error.message,
      })
    },
  })
}

export function useSetAccountActiveMutation() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setAccountActive(id, isActive),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.accounts(userId ?? ""),
      })
      toast.success(
        variables.isActive ? "Conto ripristinato" : "Conto archiviato",
      )
    },
    onError: (error: Error) => {
      toast.error("Impossibile aggiornare lo stato del conto", {
        description: error.message,
      })
    },
  })
}
