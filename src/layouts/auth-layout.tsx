import { Outlet } from "react-router-dom"
import { Wallet2 } from "lucide-react"

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 px-4 py-10">
      <div className="mb-8 flex items-center gap-2 text-xl font-semibold text-foreground">
        <Wallet2 className="size-7 text-primary" />
        MyFinance
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
