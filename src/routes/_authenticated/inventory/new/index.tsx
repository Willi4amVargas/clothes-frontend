import { Button } from '#/components/ui/button'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ProductForm } from '../-components/ProductForm'
import { useInventory } from '#/hook/useInventory'

export const Route = createFileRoute('/_authenticated/inventory/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { createInventory } = useInventory()
  return (
    <div className="mx-5 pb-10">
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Button asChild variant="link">
            <Link to="/inventory">Inventory</Link>
          </Button>
          <span>/</span>
          <Button asChild variant={'link'}>
            <span className="text-foreground font-medium">New Product</span>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create New Product
          </h1>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" asChild>
              <Link to="/inventory">
                <ArrowLeftIcon weight="bold" />
                Cancel
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <ProductForm onSubmit={createInventory.mutate} />
    </div>
  )
}
