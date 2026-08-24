import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { CategoryList } from "@/components/settings/category-list"
import { ProfileForm } from "@/components/settings/profile-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"

export function SettingsPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate("/login", { replace: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Impostazioni</h1>
        <p className="text-sm text-muted-foreground">
          Gestisci il tuo profilo, le categorie e l'account.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profilo</TabsTrigger>
          <TabsTrigger value="categories">Categorie</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profilo</CardTitle>
              <CardDescription>
                Informazioni di base del tuo profilo personale.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categorie</CardTitle>
              <CardDescription>
                Le categorie usate per organizzare entrate e uscite.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Gestisci l'accesso al tuo account MyFinance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connesso come <span className="font-medium text-foreground">{user?.email}</span>
              </p>
              <Button
                variant="outline"
                onClick={() => void handleSignOut()}
              >
                <LogOut className="size-4" />
                Esci dall'account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
