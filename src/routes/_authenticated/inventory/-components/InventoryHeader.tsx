import { Button } from '@/components/ui/button'
import { ExportIcon, PlusIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

export function InventoryHeader() {
  return (
    <div className="flex justify-between ">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Products & Multi-Unit Stock
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage inventory levels and pricing per unit
        </p>
      </div>
      <div className="my-auto grid grid-cols-2 ">
        <Button variant={'ghost'}>
          <ExportIcon />
          Export
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/inventory/new">
            <PlusIcon /> New Product
          </Link>
        </Button>
      </div>
    </div>
  )
}
