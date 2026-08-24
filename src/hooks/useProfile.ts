import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/lib/query-keys"
import { fetchProfile, updateProfile } from "@/services/profile-service"
import type { ProfileUpdate } from "@/types"

export function useProfileQuery() {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery({
    queryKey: queryKeys.profile(userId ?? ""),
    queryFn: () => fetchProfile(userId!),
    enabled: Boolean(userId),
  })
}

export function useUpdateProfileMutation() {
  const { user } = useAuth()
  const userId = user?.id
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: ProfileUpdate) => updateProfile(userId!, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile(userId ?? ""), data)
      toast.success("Profilo aggiornato")
    },
    onError: (error: Error) => {
      toast.error("Impossibile aggiornare il profilo", {
        description: error.message,
      })
    },
  })
}
