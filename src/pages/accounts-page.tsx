import { ArrowRightLeft, Plus, WalletCards } from "lucide-react"
import { useMemo, useState } from "react"

import { AccountCard } from "@/components/accounts/account-card"
import { AccountFormDialog } from "@/components/accounts/account-form-dialog"
import { TransferDialog } from "@/components/accounts/transfer-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAccountsQuery,
  useSetAccountActiveMutation,
} from "@/hooks/useAccounts"
import { formatCurrency } from "@/lib/utils"
import type { Account } from "@/types/account"

export function AccountsPage() {
  const { data: accounts, isLoading, isError, refetch } = useAccountsQuery()
  const setAccountActive = useSetAccountActiveMutation()

  const [formOpen, setFormOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | undefined>()
  const [transferOpen, setTransferOpen] = useState(false)
  const [transferFromId, setTransferFromId] = useState<string | undefined>()

  const activeAccounts = useMemo(
    () => (accounts ?? []).filter((account) => account.is_active),
    [accounts],
  )
  const archivedAccounts = useMemo(
    () => (accounts ?? []).filter((account) => !account.is_active),
    [accounts],
  )
  const totalBalance = useMemo(
    () => activeAccounts.reduce((sum, account) => sum + account.current_balance, 0),
    [activeAccounts],
  )

  function handleCreate() {
    setEditingAccount(undefined)
    setFormOpen(true)
  }

  function handleEdit(account: Account) {
    setEditingAccount(account)
    setFormOpen(true)
  }

  function handleTransfer(account?: Account) {
    setTransferFromId(account?.id)
    setTransferOpen(true)
  }

  function handleToggleActive(account: Account) {
    setAccountActive.mutate({ id: account.id, isActive: !account.is_active })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Conti</h1>
          <p className="text-sm text-muted-foreground">
            Gestisci i tuoi conti, portafogli e il saldo complessivo.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleTransfer()}
            disabled={activeAccounts.length < 2}
          >
            <ArrowRightLeft className="size-4" />
            Trasferisci
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="size-4" />
            Nuovo conto
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Saldo complessivo</p>
          {isLoading ? (
            <Skeleton className="h-9 w-40" />
          ) : (
            <p
              className={
                totalBalance < 0
                  ? "text-3xl font-bold text-destructive"
                  : "text-3xl font-bold text-success"
              }
            >
              {formatCurrency(totalBalance)}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Somma dei saldi di tutti i conti attivi
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : activeAccounts.length === 0 ? (
        <EmptyState
          icon={WalletCards}
          title="Nessun conto ancora"
          description="Crea il tuo primo conto per iniziare a monitorare le tue finanze."
          action={
            <Button onClick={handleCreate}>
              <Plus className="size-4" />
              Nuovo conto
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onTransfer={(acc) => handleTransfer(acc)}
            />
          ))}
        </div>
      )}

      {archivedAccounts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Conti archiviati
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archivedAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={handleEdit}
                onToggleActive={handleToggleActive}
                onTransfer={(acc) => handleTransfer(acc)}
              />
            ))}
          </div>
        </div>
      )}

      <AccountFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        account={editingAccount}
      />
      <TransferDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        accounts={accounts ?? []}
        defaultFromAccountId={transferFromId}
      />
    </div>
  )
}
