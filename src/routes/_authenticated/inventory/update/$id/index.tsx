import { Button } from '#/components/ui/button'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ProductForm } from '../../-components/ProductForm'
import { useInventory, useInventoryDetails } from '#/hook/useInventory'

export const Route = createFileRoute('/_authenticated/inventory/update/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { updateInventory, deleteInventory } = useInventory()
  const { inventoryDetails } = useInventoryDetails(+id)
  return (
    <div className={`mx-5 pb-10 ${inventoryDetails.data ? '' : 'text-center'}`}>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Button asChild variant="link">
            <Link to="/inventory">Inventory</Link>
          </Button>
          <span>/</span>
          <Button asChild variant={'link'}>
            <span className="text-foreground font-medium">Update Product</span>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            Update Product
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

      {inventoryDetails.data ? (
        <ProductForm
          onSubmit={(e) =>
            updateInventory.mutate({
              id: inventoryDetails.data.id,
              body: {
                code: e.code,
                description: e.description,
                mark: e.mark,
                model: e.model,
                referenc: e.referenc,
                discount: e.discount,
                status: e.status,
                origin: e.origin,
                buy_tax: e.buy_tax,
                sale_tax: e.sale_tax,
                // @ts-ignore this value come in the value send
                products_units: e.products_units,
              },
            })
          }
          defaultValues={{
            ...inventoryDetails.data,
            products_units: inventoryDetails.data.units,
          }}
          onDeleteButtonPress={() =>
            deleteInventory.mutate(inventoryDetails.data.id)
          }
        />
      ) : (
        <span className="text-primary text-center ">
          Cargando producto...
        </span>
      )}
    </div>
  )
}
