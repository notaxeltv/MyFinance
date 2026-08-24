import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"
import { MOBILE_NAV_ITEMS } from "@/lib/navigation"

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:hidden"
      aria-label="Navigazione principale"
    >
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )
          }
        >
          <item.icon className="size-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
