import { Plus, Tags, Trash2 } from "lucide-react"
import { useState } from "react"

import { CategoryFormDialog } from "@/components/settings/category-form-dialog"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/hooks/useCategories"
import { getIconComponent } from "@/lib/icons"
import { CATEGORY_TYPE_LABELS, type Category } from "@/types/category"

export function CategoryList() {
  const { data: categories, isLoading, isError, refetch } = useCategoriesQuery()
  const deleteCategory = useDeleteCategoryMutation()

  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [deletingCategory, setDeletingCategory] = useState<Category | undefined>()

  function handleCreate() {
    setEditingCategory(undefined)
    setFormOpen(true)
  }

  function handleEdit(category: Category) {
    setEditingCategory(category)
    setFormOpen(true)
  }

  function handleConfirmDelete() {
    if (!deletingCategory) return
    deleteCategory.mutate(deletingCategory.id)
    setDeletingCategory(undefined)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Personalizza le categorie usate per entrate e uscite.
        </p>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="size-4" />
          Nuova categoria
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : !categories || categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="Nessuna categoria"
          description="Crea la tua prima categoria personalizzata."
        />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {categories.map((category) => {
            const Icon = getIconComponent(category.icon)
            return (
              <li
                key={category.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => handleEdit(category)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${category.color ?? "#64748b"}1a`,
                      color: category.color ?? "#64748b",
                    }}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {CATEGORY_TYPE_LABELS[category.type]}
                  </Badge>
                  {category.is_default && (
                    <Badge variant="outline" className="text-xs">
                      Predefinita
                    </Badge>
                  )}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Elimina categoria"
                  disabled={category.is_default}
                  title={
                    category.is_default
                      ? "Le categorie predefinite non possono essere eliminate"
                      : "Elimina categoria"
                  }
                  onClick={() => setDeletingCategory(category)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
      />

      <AlertDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare la categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              La categoria "{deletingCategory?.name}" verrà eliminata
              definitivamente. I movimenti collegati resteranno senza
              categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
