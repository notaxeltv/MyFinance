import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getIconComponent, ICON_NAMES } from "@/lib/icons"
import { cn } from "@/lib/utils"

interface IconPickerProps {
  value?: string | null
  onChange: (value: string) => void
  color?: string | null
}

export function IconPicker({ value, onChange, color }: IconPickerProps) {
  const SelectedIcon = getIconComponent(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 shrink-0"
          style={{ color: color ?? undefined }}
          aria-label="Scegli un'icona"
        >
          <SelectedIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="grid grid-cols-6 gap-1">
          {ICON_NAMES.map((name) => {
            const Icon = getIconComponent(name)
            const isSelected = value === name
            return (
              <button
                key={name}
                type="button"
                onClick={() => onChange(name)}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  isSelected &&
                    "border-primary bg-primary/10 text-primary",
                )}
                aria-label={name}
              >
                <Icon className="size-4" />
                {isSelected && (
                  <Check className="absolute -right-1 -top-1 size-3 rounded-full bg-primary text-primary-foreground" />
                )}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
