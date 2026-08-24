import { PlusCircle } from "lucide-react"

import { PlaceholderPage } from "@/components/layout/placeholder-page"

export function NewTransactionPage() {
  return (
    <PlaceholderPage
      title="Nuovo movimento"
      description="Aggiungi rapidamente una nuova entrata o uscita."
      icon={PlusCircle}
    />
  )
}
