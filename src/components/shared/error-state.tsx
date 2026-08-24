import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Si è verificato un errore",
  description = "Non è stato possibile caricare i dati. Riprova.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-destructive/40 bg-destructive/5 px-6 py-16 text-center">
      <AlertTriangle className="size-10 text-destructive/70" />
      <div className="space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Riprova
        </Button>
      )}
    </div>
  )
}
