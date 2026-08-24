import { Repeat } from "lucide-react"

import { PlaceholderPage } from "@/components/layout/placeholder-page"

export function RecurringPage() {
  return (
    <PlaceholderPage
      title="Movimenti ricorrenti"
      description="Gestisci le entrate e le uscite che si ripetono nel tempo."
      icon={Repeat}
    />
  )
}
