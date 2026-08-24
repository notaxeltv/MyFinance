import { LayoutDashboard } from "lucide-react"

import { PlaceholderPage } from "@/components/layout/placeholder-page"

export function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Panoramica delle tue finanze personali."
      icon={LayoutDashboard}
    />
  )
}
