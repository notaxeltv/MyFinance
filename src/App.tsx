import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import {
  ProtectedRoute,
  PublicOnlyRoute,
} from "@/components/layout/protected-route"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { useAuth, AuthProvider } from "@/hooks/useAuth"
import { AppLayout } from "@/layouts/app-layout"
import { AuthLayout } from "@/layouts/auth-layout"
import { AccountsPage } from "@/pages/accounts-page"
import { BudgetsPage } from "@/pages/budgets-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { ForgotPasswordPage } from "@/pages/forgot-password-page"
import { GoalsPage } from "@/pages/goals-page"
import { LoginPage } from "@/pages/login-page"
import { NewTransactionPage } from "@/pages/new-transaction-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { PokemonPage } from "@/pages/pokemon-page"
import { RecurringPage } from "@/pages/recurring-page"
import { RegisterPage } from "@/pages/register-page"
import { ReportsPage } from "@/pages/reports-page"
import { ResetPasswordPage } from "@/pages/reset-password-page"
import { SettingsPage } from "@/pages/settings-page"
import { TransactionsPage } from "@/pages/transactions-page"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppRoutes() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/new" element={<NewTransactionPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/recurring" element={<RecurringPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/pokemon" element={<PokemonPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
