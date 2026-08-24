import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { ColorPicker } from "@/components/shared/color-picker"
import { IconPicker } from "@/components/shared/icon-picker"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/hooks/useCategories"
import { DEFAULT_COLOR } from "@/lib/colors"
import { categorySchema, type CategoryFormValues } from "@/lib/validations"
import {
  CATEGORY_TYPE_LABELS,
  CATEGORY_TYPES,
  type Category,
} from "@/types/category"

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category
}

const DEFAULT_VALUES: CategoryFormValues = {
  name: "",
  type: "expense",
  color: DEFAULT_COLOR,
  icon: "more-horizontal",
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const isEditing = Boolean(category)
  const createCategory = useCreateCategoryMutation()
  const updateCategory = useUpdateCategoryMutation()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (!open) return

    if (category) {
      form.reset({
        name: category.name,
        type: category.type,
        color: category.color ?? DEFAULT_COLOR,
        icon: category.icon ?? "more-horizontal",
      })
    } else {
      form.reset(DEFAULT_VALUES)
    }
  }, [open, category, form])

  const isSubmitting = createCategory.isPending || updateCategory.isPending

  async function onSubmit(values: CategoryFormValues) {
    if (isEditing && category) {
      await updateCategory.mutateAsync({
        id: category.id,
        updates: {
          name: values.name,
          type: values.type as Category["type"],
          color: values.color,
          icon: values.icon,
        },
      })
    } else {
      await createCategory.mutateAsync({
        name: values.name,
        type: values.type as Category["type"],
        color: values.color,
        icon: values.icon,
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifica categoria" : "Nuova categoria"}
          </DialogTitle>
          <DialogDescription>
            Le categorie ti aiutano a organizzare entrate e uscite.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="flex items-end gap-3">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icona</FormLabel>
                    <FormControl>
                      <IconPicker
                        value={field.value}
                        onChange={field.onChange}
                        color={form.watch("color")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Es. Alimentari" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colore</FormLabel>
                  <FormControl>
                    <ColorPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {CATEGORY_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isEditing ? "Salva modifiche" : "Crea categoria"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
