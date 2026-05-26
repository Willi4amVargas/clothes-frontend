import { createFileRoute } from '@tanstack/react-router'
import { InventoryHeader } from './-components/InventoryHeader'
import { InventoryList } from './-components/InventoryList'
import { InventoryListUnits } from './-components/InventoryListUnits'
import {
  InventoryStatsCard,
  type InventoryStatsCardProps,
} from './-components/InventoryStatsCard'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/inventory/')({
  component: RouteComponent,
})

const inventoryStats: InventoryStatsCardProps[] = [
  {
    title: 'Total SKUs',
    value: '4,281',
    trendLabel: '',
    trendTone: 'neutral',
  },
  {
    title: 'Low Stock Alerts',
    value: '24',
    trendLabel: 'items need attention',
    trendTone: 'negative',
  },
  {
    title: 'Total Inventory Value',
    value: '$1.2M',
    trendLabel: '',
    trendTone: 'neutral',
  },
  {
    title: 'Recent Operations',
    value: '142',
    trendLabel: 'today',
    trendTone: 'neutral',
  },
]

function RouteComponent() {
  const [selectProduct, setSelectProduct] = useState<number | undefined>(undefined)
  return (
    <div className="mx-5">
      <InventoryHeader />
      {/* <div className="grid grid-cols-4 gap-3 mt-4">
        {inventoryStats.map((i) => (
          <InventoryStatsCard
            key={i.title}
            title={i.title}
            trendLabel={i.trendLabel}
            trendTone={i.trendTone}
            value={i.value}
          />
        ))}
      </div> */}
      <div className="grid grid-cols-5 gap-x-2 mt-4">
        <div className="col-span-3">
          <InventoryList setSelectedProduct={setSelectProduct} />
        </div>
        <div className="col-span-2">
          <InventoryListUnits selectProduct={selectProduct} />
        </div>
      </div>
    </div>
  )
}
