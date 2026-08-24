import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/lib/query-keys"
import {
  createTransfer,
  type CreateTransferInput,
} from "@/services/transfer-service"

export function useCreateTransferMutation() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Omit<CreateTransferInput, "user_id">) =>
      createTransfer({ ...input, user_id: userId! }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.accounts(userId ?? ""),
      })
      toast.success("Trasferimento completato")
    },
    onError: (error: Error) => {
      toast.error("Impossibile completare il trasferimento", {
        description: error.message,
      })
    },
  })
}
