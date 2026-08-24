import { type ClassValue, clsx } from "clsx"
import { format, parseISO } from "date-fns"
import { it } from "date-fns/locale"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
})

/** Formatta un importo in euro secondo le convenzioni italiane (es. "1.234,56 €"). */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/** Formatta una data (stringa ISO o Date) in formato italiano, es. "24 ago 2026". */
export function formatDate(value: string | Date, pattern = "d MMM yyyy"): string {
  const date = typeof value === "string" ? parseISO(value) : value
  return format(date, pattern, { locale: it })
}

/** Restituisce le classi colore coerenti con il segno del valore (verde/rosso). */
export function getAmountColorClass(value: number): string {
  if (value > 0) return "text-success"
  if (value < 0) return "text-destructive"
  return "text-muted-foreground"
}
