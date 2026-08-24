import type { LucideIcon } from "lucide-react"

interface PlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
}

/** Segnaposto per le sezioni non ancora implementate nelle fasi successive. */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 py-20 text-center">
        <Icon className="size-10 text-muted-foreground/50" />
        <p className="max-w-sm text-sm text-muted-foreground">
          Questa sezione sarà disponibile in una prossima fase di sviluppo.
        </p>
      </div>
    </div>
  )
}
