import type { LucideIcon } from "lucide-react"
import {
  ArrowLeftRight,
  LayoutDashboard,
  PiggyBank,
  Repeat,
  Settings,
  Sparkles,
  Target,
  Wallet,
  WalletCards,
} from "lucide-react"

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Mostrato anche nella barra di navigazione compatta su mobile. */
  showOnMobile?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    showOnMobile: true,
  },
  {
    to: "/transactions",
    label: "Movimenti",
    icon: ArrowLeftRight,
    showOnMobile: true,
  },
  {
    to: "/accounts",
    label: "Conti",
    icon: WalletCards,
    showOnMobile: true,
  },
  {
    to: "/budgets",
    label: "Budget",
    icon: Wallet,
  },
  {
    to: "/recurring",
    label: "Ricorrenti",
    icon: Repeat,
  },
  {
    to: "/goals",
    label: "Obiettivi",
    icon: Target,
  },
  {
    to: "/pokemon",
    label: "Pokémon",
    icon: Sparkles,
    showOnMobile: true,
  },
  {
    to: "/reports",
    label: "Report",
    icon: PiggyBank,
  },
  {
    to: "/settings",
    label: "Impostazioni",
    icon: Settings,
  },
]

export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.showOnMobile)
