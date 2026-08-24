import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/useProfile"
import { profileSchema, type ProfileFormValues } from "@/lib/validations"

const CURRENCY_OPTIONS = ["EUR", "USD", "GBP", "CHF"]

export function ProfileForm() {
  const { data: profile, isLoading } = useProfileQuery()
  const updateProfile = useUpdateProfileMutation()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: "", defaultCurrency: "EUR" },
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.display_name ?? "",
        defaultCurrency: (profile.default_currency ?? "EUR") as ProfileFormValues["defaultCurrency"],
      })
    }
  }, [profile, form])

  function onSubmit(values: ProfileFormValues) {
    updateProfile.mutate({
      display_name: values.displayName,
      default_currency: values.defaultCurrency,
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome visualizzato</FormLabel>
              <FormControl>
                <Input placeholder="Il tuo nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valuta predefinita</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending && (
            <Loader2 className="size-4 animate-spin" />
          )}
          Salva profilo
        </Button>
      </form>
    </Form>
  )
}
