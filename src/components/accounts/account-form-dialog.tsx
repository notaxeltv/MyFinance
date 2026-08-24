import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { ColorPicker } from "@/components/shared/color-picker"
import { IconPicker } from "@/components/shared/icon-picker"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateAccountMutation, useUpdateAccountMutation } from "@/hooks/useAccounts"
import { DEFAULT_COLOR } from "@/lib/colors"
import { accountSchema, type AccountFormValues } from "@/lib/validations"
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPES, type Account } from "@/types/account"

const CURRENCY_OPTIONS = ["EUR", "USD", "GBP", "CHF"]

interface AccountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: Account
}

const DEFAULT_VALUES: AccountFormValues = {
  name: "",
  type: "checking",
  currency: "EUR",
  initialBalance: 0,
  color: DEFAULT_COLOR,
  icon: "wallet",
}

export function AccountFormDialog({
  open,
  onOpenChange,
  account,
}: AccountFormDialogProps) {
  const isEditing = Boolean(account)
  const createAccount = useCreateAccountMutation()
  const updateAccount = useUpdateAccountMutation()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (!open) return

    if (account) {
      form.reset({
        name: account.name,
        type: account.type,
        currency: account.currency,
        initialBalance: account.initial_balance,
        color: account.color ?? DEFAULT_COLOR,
        icon: account.icon ?? "wallet",
      })
    } else {
      form.reset(DEFAULT_VALUES)
    }
  }, [open, account, form])

  const isSubmitting = createAccount.isPending || updateAccount.isPending

  async function onSubmit(values: AccountFormValues) {
    if (isEditing && account) {
      await updateAccount.mutateAsync({
        id: account.id,
        updates: {
          name: values.name,
          type: values.type as Account["type"],
          currency: values.currency.toUpperCase(),
          initial_balance: values.initialBalance,
          color: values.color,
          icon: values.icon,
        },
      })
    } else {
      await createAccount.mutateAsync({
        name: values.name,
        type: values.type as Account["type"],
        currency: values.currency.toUpperCase(),
        initial_balance: values.initialBalance,
        current_balance: values.initialBalance,
        color: values.color,
        icon: values.icon,
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica conto" : "Nuovo conto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Aggiorna i dettagli del conto."
              : "Crea un nuovo conto o portafoglio da tracciare."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="flex items-end gap-3">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icona</FormLabel>
                    <FormControl>
                      <IconPicker
                        value={field.value}
                        onChange={field.onChange}
                        color={form.watch("color")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Es. Conto principale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colore</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACCOUNT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {ACCOUNT_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valuta</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="initialBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo iniziale</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      inputMode="decimal"
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      value={Number.isNaN(field.value) ? "" : field.value}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isEditing ? "Salva modifiche" : "Crea conto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
