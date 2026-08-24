import { LogOut, Settings, User as UserIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"

function getInitials(value: string) {
  return value.slice(0, 2).toUpperCase()
}

export function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const email = user?.email ?? ""
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) || email

  async function handleSignOut() {
    await signOut()
    navigate("/login", { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 rounded-full px-2"
          aria-label="Menu utente"
        >
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {getInitials(displayName || "U")}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate text-xs text-muted-foreground">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <UserIcon className="size-4" />
          Il mio profilo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="size-4" />
          Impostazioni
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => void handleSignOut()}
        >
          <LogOut className="size-4" />
          Esci
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
