import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, MailCheck } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations"

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsSubmitting(true)
    setServerError(null)
    const { error } = await requestPasswordReset(values.email)
    setIsSubmitting(false)

    if (error) {
      setServerError(error)
      return
    }

    setIsSent(true)
  }

  if (isSent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
          <MailCheck className="size-10 text-primary" />
          <h2 className="text-lg font-semibold">Controlla la tua email</h2>
          <p className="text-sm text-muted-foreground">
            Se l'indirizzo inserito è associato a un account, riceverai un
            link per reimpostare la password.
          </p>
          <Button asChild className="mt-2 w-full">
            <Link to="/login">Torna al login</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recupera la password</CardTitle>
        <CardDescription>
          Inserisci la tua email: ti invieremo un link per reimpostarla.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="nome@esempio.it"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Invia link di recupero
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Torna al login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
