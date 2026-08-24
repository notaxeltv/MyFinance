import { Outlet } from "react-router-dom"

import { BottomNav } from "@/components/layout/bottom-nav"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

export function AppLayout() {
  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar />
      <div className="flex min-h-svh flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 pb-20 pt-4 sm:px-6 sm:pb-6 lg:pb-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
