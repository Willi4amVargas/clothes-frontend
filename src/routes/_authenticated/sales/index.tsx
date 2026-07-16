import { createFileRoute, Link } from '@tanstack/react-router'
import { useSalesOperations } from '#/hook/useSalesOperation'
// Asumiendo rutas estándar para componentes de shadcn en tu proyecto
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useClients } from '#/hook/useClient'
import {
  CalendarIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  FadersIcon,
  PlusIcon,
  TrendUpIcon,
} from '@phosphor-icons/react'

export const Route = createFileRoute('/_authenticated/sales/')({
  component: RouteComponent,
})

const getOperationName = (type: string) => {
  const types: Record<string, string> = {
    QUOTATION: 'Cotización',
    SALE: 'Venta',
    ORDER: 'Orden de Venta',
  }
  return types[type] || type
}

function RouteComponent() {
  const { salesOperations } = useSalesOperations()
  const { clients: clientsData } = useClients()

  if (salesOperations.isLoading) {
    return <div className="p-6">Cargando operaciones de venta...</div>
  }

  if (salesOperations.isError) {
    return (
      <div className="p-6 text-destructive">
        Error cargando operaciones de venta
      </div>
    )
  }

  const clients = clientsData.data
  const data = salesOperations.data || []

  // Cálculos dinámicos para los KPIs basados en el payload real
  const totalSalesAmount = data.reduce((acc, curr) => acc + curr.total, 0)
  const pendingOrdersCount = data.filter((op) => op.pending).length
  const averageTicket = data.length > 0 ? totalSalesAmount / data.length : 0

  // Margen bruto = (Total Neto - Costo Neto) / Total Neto
  const totalNet = data.reduce((acc, curr) => acc + curr.total_net, 0)
  const totalCost = data.reduce((acc, curr) => acc + curr.total_net_cost, 0)
  const grossMargin =
    totalNet > 0 ? ((totalNet - totalCost) / totalNet) * 100 : 0

  return (
    <div className="px-6 space-y-2 my-2">
      {/* 1. SECCIÓN DE KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
              Ventas Totales
            </CardTitle>
            <CurrencyDollarIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${totalSalesAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className=" border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
              Órdenes Pendientes
            </CardTitle>
            <ClipboardIcon className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {pendingOrdersCount}
            </div>
          </CardContent>
        </Card>

        <Card className=" border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
              Venta Promedio
            </CardTitle>
            <CurrencyDollarIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${averageTicket.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className=" border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase text-muted-foreground">
              Margen Bruto %
            </CardTitle>
            <TrendUpIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {grossMargin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Button className="h-full" asChild>
          <Link to="/sales/new">
            <PlusIcon /> NUEVA VENTA
          </Link>
        </Button>
      </div>

      {/* 2. SECCIÓN DE FILTROS */}
      <Card className="grid grid-cols-5 border-primary/20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 col-span-4">
          <div className="">
            <label className="text-xs text-muted-foreground">
              Rango de Fecha
            </label>
            <div className="flex items-center border border-input px-3 h-10 ">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
              <span className="text-sm">Últimos 30 días</span>
            </div>
          </div>

          <div className="">
            <label className="text-xs text-muted-foreground">Estado</label>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <label className="text-xs text-muted-foreground">
              Tipo de Operación
            </label>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="SALE">Venta</SelectItem>
                <SelectItem value="QUOTATION">Cotización</SelectItem>
                <SelectItem value="ORDER">Orden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <label className="text-xs text-muted-foreground">
              Vendedor / Cliente (ID)
            </label>
            <Input className="" placeholder="Filtrar por vendedor..." />
          </div>
        </div>

        <div className="flex my-auto">
          <Button
            variant="outline"
            className=" border-primary text-primary hover:bg-primary/10"
          >
            <FadersIcon className="mr-2 h-4 w-4" /> Filtros
          </Button>
          {/* <Button className=" bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <DownloadIcon className="mr-2 h-4 w-4" /> Exportar
          </Button> */}
        </div>
      </Card>

      {/* 3. SECCIÓN DE TABLA */}
      <div className="relative overflow-y-auto bg-white border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">
                Nº DOCUMENTO
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                FECHA / HORA
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                CLIENTE
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                VENDEDOR
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">
                TOTAL
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-center">
                TIPO
              </TableHead>
              {/* <TableHead className="font-bold text-right">ACCIONES</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((operation) => (
              <TableRow key={operation.id}>
                <TableCell className="">
                  <Button asChild variant={'link'} className="p-0">
                    <Link
                      to="/sales/$id"
                      params={{ id: `${operation.id?.toString()}` }}
                    >
                      #{operation.document_no}
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  {new Date(operation.emission_date).toLocaleString('es-VE', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </TableCell>
                <TableCell>
                  {clients && (
                    <>
                      {
                        clients.find((c) => c.id === operation.client_id)
                          ?.description
                      }
                    </>
                  )}
                </TableCell>
                <TableCell>{operation.seller}</TableCell>
                <TableCell className="text-right font-bold">
                  ${operation.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={` border-0`}>
                    {getOperationName(operation.operation_type)}
                  </Badge>
                </TableCell>
                {/* <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <Link
                      to="/sales/$id"
                      params={{ id: `${operation.id?.toString()}` }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className=" h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className=" h-8 w-8 text-secondary hover:bg-secondary/10 hover:text-secondary"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className=" h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 4. PAGINACIÓN */}
      <div className="flex items-center justify-between px-4 py-4 border-t text-sm text-muted-foreground">
        <div>Mostrando 1-{data.length} registros</div>
        <div className="flex space-x-1">
          <Button variant="outline" size="icon" className=" h-8 w-8" disabled>
            &lt;
          </Button>
          <Button variant="default" size="icon" className=" h-8 w-8 bg-primary">
            1
          </Button>
          <Button variant="outline" size="icon" className=" h-8 w-8">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}
