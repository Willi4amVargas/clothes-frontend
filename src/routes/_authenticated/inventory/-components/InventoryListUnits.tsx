import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  ArrowRightIcon,
  CircleNotchIcon,
  PackageIcon,
} from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { useInventoryDetails } from '#/hook/useInventory'

export const InventoryListUnits = ({
  selectProduct,
}: {
  selectProduct: number | undefined
}) => {
  const { inventoryDetails } = useInventoryDetails(selectProduct)

  if (!selectProduct) {
    return (
      <Card className="mx-auto flex flex-col items-center justify-center p-12 text-center border-dashed">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-4">
          <PackageIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">
          No hay selección
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Elija un producto en la tabla de la izquierda para ver el desglose de
          unidades y stock.
        </p>
      </Card>
    )
  }

  if (inventoryDetails.isLoading) {
    return (
      <Card className="mx-auto animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border h-[69px]">
          <div className="flex items-center gap-3">
            <CircleNotchIcon className="h-5 w-5 animate-spin text-primary" />
            <div className="h-5 w-24 bg-muted rounded" />
          </div>
          <div className="h-4 w-16 bg-muted rounded" />
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          <div className="h-6 w-2/3 bg-muted rounded mt-1" />
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-8 bg-muted/40 rounded w-full" />
            <div className="h-8 bg-muted/40 rounded w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (inventoryDetails.isError) {
    return (
      <Card className="mx-auto border-destructive/50 bg-destructive/5 p-6 text-center">
        <h3 className="text-sm font-semibold text-destructive">
          Error al cargar detalles
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          No se pudieron recuperar los datos de este producto. Intente
          seleccionarlo nuevamente.
        </p>
      </Card>
    )
  }
  return (
    <Card className="mx-auto">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border">
        <CardTitle className="text-xl font-semibold text-foreground">
          {inventoryDetails.data?.referenc}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-muted-foreground">
          {inventoryDetails.data?.code}
        </CardDescription>
        {inventoryDetails.data && (
          <Button asChild variant={'link'} className="w-1/4">
            <Link
              to={'/inventory/update/$id'}
              params={{ id: `${inventoryDetails.data.id}` }}
            >
              Details <ArrowRightIcon />
            </Link>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <h3 className="text-xl font-semibold text-foreground pt-1">
          {inventoryDetails.data?.description}
        </h3>

        <Table className="border-t border-border">
          <TableHeader>
            <TableRow className="border-b-0 hover:bg-transparent">
              <TableHead className="text-sm font-normal text-muted-foreground w-32.5">
                Unit Type
              </TableHead>
              <TableHead className="text-sm font-normal text-muted-foreground text-right">
                Cost
              </TableHead>
              <TableHead className="text-sm font-normal text-muted-foreground text-right">
                Price
              </TableHead>
              <TableHead className="text-sm font-normal text-primary-500 text-right">
                In Stock
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryDetails.data &&
              inventoryDetails.data.units.map((unit) => (
                <TableRow
                  key={unit.id}
                  className="border-b border-dotted border-border last:border-b-0 hover:bg-zinc-50/50"
                >
                  <TableCell className="text-sm font-semibold text-zinc-900 py-3">
                    {unit.unit}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-zinc-900 text-right">
                    ${unit.cost.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-zinc-900 text-right">
                    ${unit.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-primary-600 text-right">
                    {
                      inventoryDetails.data.stock.find(
                        (stock) => stock.unit === unit.id,
                      )?.stock
                    }
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
