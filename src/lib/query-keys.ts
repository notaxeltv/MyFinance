export const queryKeys = {
  profile: (userId: string) => ["profile", userId] as const,
  accounts: (userId: string) => ["accounts", userId] as const,
  categories: (userId: string) => ["categories", userId] as const,
}
