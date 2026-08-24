import {
  Archive,
  ArchiveRestore,
  ArrowRightLeft,
  ListOrdered,
  MoreHorizontal,
  Pencil,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getIconComponent } from "@/lib/icons"
import { cn, formatCurrency } from "@/lib/utils"
import { ACCOUNT_TYPE_LABELS, type Account } from "@/types/account"

interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onToggleActive: (account: Account) => void
  onTransfer: (account: Account) => void
}

export function AccountCard({
  account,
  onEdit,
  onToggleActive,
  onTransfer,
}: AccountCardProps) {
  const navigate = useNavigate()
  const Icon = getIconComponent(account.icon)
  const isNegative = account.current_balance < 0

  return (
    <Card
      className={cn(
        "transition-opacity",
        !account.is_active && "opacity-60",
      )}
    >
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${account.color ?? "#64748b"}1a`,
              color: account.color ?? "#64748b",
            }}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <p className="font-medium leading-tight">{account.name}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {ACCOUNT_TYPE_LABELS[account.type]}
              </Badge>
              {!account.is_active && (
                <Badge variant="outline" className="text-xs">
                  Archiviato
                </Badge>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Azioni conto">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(account)}>
              <Pencil className="size-4" />
              Modifica
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTransfer(account)}>
              <ArrowRightLeft className="size-4" />
              Trasferisci denaro
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/transactions?account=${account.id}`)}
            >
              <ListOrdered className="size-4" />
              Vedi movimenti
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(account)}>
              {account.is_active ? (
                <>
                  <Archive className="size-4" />
                  Archivia
                </>
              ) : (
                <>
                  <ArchiveRestore className="size-4" />
                  Ripristina
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>

      <CardContent className="pt-0">
        <p
          className={cn(
            "text-2xl font-semibold",
            isNegative ? "text-destructive" : "text-success",
          )}
        >
          {formatCurrency(account.current_balance)}
        </p>
        <p className="text-xs text-muted-foreground">
          Saldo iniziale {formatCurrency(account.initial_balance)}
        </p>
      </CardContent>
    </Card>
  )
}
