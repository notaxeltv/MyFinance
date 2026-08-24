import { Check } from "lucide-react"

import { COLOR_PRESETS } from "@/lib/colors"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value?: string | null
  onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PRESETS.map((color) => {
        const isSelected = value === color
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-background transition-transform hover:scale-105",
              isSelected && "ring-foreground/70",
            )}
            style={{ backgroundColor: color }}
            aria-label={`Colore ${color}`}
          >
            {isSelected && <Check className="size-4 text-white" />}
          </button>
        )
      })}
    </div>
  )
}
