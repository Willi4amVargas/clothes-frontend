import { createFileRoute } from '@tanstack/react-router'
import { InventoryHeader } from './-components/InventoryHeader'
import { InventoryList } from './-components/InventoryList'
import { InventoryListUnits } from './-components/InventoryListUnits'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/inventory/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectProduct, setSelectProduct] = useState<number | undefined>(
    undefined,
  )
  return (
    <div className="mx-5">
      <InventoryHeader />
      <div className="grid grid-cols-5 gap-x-2 mt-4">
        <div className="col-span-3">
          <InventoryList
            selectProduct={selectProduct}
            setSelectedProduct={setSelectProduct}
          />
        </div>
        <div className="col-span-2">
          <InventoryListUnits selectProduct={selectProduct} />
        </div>
      </div>
    </div>
  )
}
