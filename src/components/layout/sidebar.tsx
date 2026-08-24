import { NavLink } from "react-router-dom"

import { Wallet2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/lib/navigation"

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Wallet2 className="size-6 text-primary" />
        <span className="text-lg font-semibold">MyFinance</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/60">
        MyFinance · Gestione finanze personali
      </div>
    </aside>
  )
}
