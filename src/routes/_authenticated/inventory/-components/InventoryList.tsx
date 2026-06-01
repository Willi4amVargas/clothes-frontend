import { useState, useMemo } from 'react'
import { FunnelIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useInventory } from '#/hook/useInventory'

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function InventoryList({ setSelectedProduct }: { setSelectedProduct: React.Dispatch<React.SetStateAction<number | undefined>> }) {
  const { inventory } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = useMemo(() => {
    const products = inventory.data
    if (!products) return []

    const query = searchTerm.toLowerCase().trim()
    if (!query) return products

    return products.filter((item) => {
      const code = item.code?.toLowerCase() || ""
      const description = item.description?.toLowerCase() || ""
      const model = item.model?.toLowerCase() || ""

      return code.includes(query) || description.includes(query) || model.includes(query)
    })
  }, [inventory, searchTerm])

  if (inventory.isLoading) {
    return <div className="p-8 text-center text-gray-500">Cargando inventario...</div>
  }

  if (inventory.isError) {
    return <div className="p-8 text-center text-destructive">Error al cargar los productos.</div>
  }

  return (
    <div className="w-full ring-1 ring-foreground/10 overflow-hidden bg-white">
      <div className="flex items-center gap-2 p-4 border-b bg-gray-50/50">
        <div className="relative grow max-w-sm">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter products..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="text-gray-500">
          <MagnifyingGlassIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative h-[45vh] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900 w-30">Code</TableHead>
              <TableHead className="font-semibold text-gray-900">Product Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Category</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Discount</TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:cursor-pointer"
                  onClick={() => setSelectedProduct(item.id)}
                >
                  <TableCell className="font-medium text-gray-700">{item.code}</TableCell>
                  <TableCell className="text-gray-900 truncate max-w-xs w-1/6">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-gray-600">{item.model}</TableCell>
                  <TableCell>% {formatNumber(+item.discount)}</TableCell>
                  <TableCell className="text-right">
                    {item.status ? (
                      <Badge variant="default">ACTIVE</Badge>
                    ) : (
                      <Badge variant="destructive">DISABLED</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}