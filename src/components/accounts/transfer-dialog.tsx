import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { useCreateTransferMutation } from "@/hooks/useTransfers"
import { formatCurrency } from "@/lib/utils"
import type { Account } from "@/types/account"

const transferSchema = z
  .object({
    fromAccountId: z.string().min(1, "Seleziona il conto di origine."),
    toAccountId: z.string().min(1, "Seleziona il conto di destinazione."),
    amount: z
      .number({ message: "Inserisci un importo valido." })
      .positive("L'importo deve essere maggiore di zero."),
    transferDate: z.string().min(1, "Seleziona una data."),
    description: z.string().trim().max(200).optional(),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: "Il conto di origine e destinazione devono essere diversi.",
    path: ["toAccountId"],
  })

type TransferFormValues = z.infer<typeof transferSchema>

interface TransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Account[]
  defaultFromAccountId?: string
}

export function TransferDialog({
  open,
  onOpenChange,
  accounts,
  defaultFromAccountId,
}: TransferDialogProps) {
  const createTransfer = useCreateTransferMutation()

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccountId: defaultFromAccountId ?? "",
      toAccountId: "",
      amount: 0,
      transferDate: format(new Date(), "yyyy-MM-dd"),
      description: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        fromAccountId: defaultFromAccountId ?? "",
        toAccountId: "",
        amount: 0,
        transferDate: format(new Date(), "yyyy-MM-dd"),
        description: "",
      })
    }
  }, [open, defaultFromAccountId, form])

  async function onSubmit(values: TransferFormValues) {
    await createTransfer.mutateAsync({
      from_account_id: values.fromAccountId,
      to_account_id: values.toAccountId,
      amount: values.amount,
      transfer_date: values.transferDate,
      description: values.description || null,
    })
    onOpenChange(false)
  }

  const activeAccounts = accounts.filter((account) => account.is_active)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trasferisci denaro</DialogTitle>
          <DialogDescription>
            Sposta denaro tra due tuoi conti. Il saldo di entrambi verrà
            aggiornato automaticamente.
          </DialogDescription>
        </DialogHeader>

        {activeAccounts.length < 2 ? (
          <p className="text-sm text-muted-foreground">
            Servono almeno due conti attivi per effettuare un trasferimento.
          </p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="fromAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Da</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Conto di origine" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} · {formatCurrency(account.current_balance)}
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
                  name="toAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>A</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Conto di destinazione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Importo (€)</FormLabel>
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

              <FormField
                control={form.control}
                name="transferDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione (opzionale)</FormLabel>
                    <FormControl>
                      <Input placeholder="Es. Risparmio mensile" {...field} />
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
                <Button type="submit" disabled={createTransfer.isPending}>
                  {createTransfer.isPending && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Trasferisci
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
