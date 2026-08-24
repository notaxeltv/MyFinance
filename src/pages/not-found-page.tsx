import { CompassIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <CompassIcon className="size-12 text-muted-foreground" />
      <h1 className="text-3xl font-semibold">Pagina non trovata</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        La pagina che stai cercando non esiste o è stata spostata.
      </p>
      <Button asChild>
        <Link to="/dashboard">Torna alla dashboard</Link>
      </Button>
    </div>
  )
}
