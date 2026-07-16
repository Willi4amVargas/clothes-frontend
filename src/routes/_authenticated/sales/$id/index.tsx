import { useSalesOperation } from '#/hook/useSalesOperation'
import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Printer, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BreadcrumbMain } from '#/components/BreadcrumbMain'
import { useClients } from '#/hook/useClient'
import { useUsers } from '#/hook/useUsers'

export const Route = createFileRoute('/_authenticated/sales/$id/')({
  component: RouteComponent,
})

// Función auxiliar para formatear moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

// Función auxiliar para traducir el tipo de operación
const getOperationName = (type: string) => {
  const types: Record<string, string> = {
    QUOTATION: 'Cotización',
    SALE: 'Venta',
    ORDER: 'Orden de Venta',
  }
  return types[type] || type
}

function UserCreator({ id }: { id: number }) {
  const { userBasic } = useUsers(id)
  if (userBasic.isLoading) {
    return <>Cargando usuario...</>
  }

  if (userBasic.isError) {
    return <span className="text-red-500">El usuario no pudo ser cargado</span>
  }
  if (userBasic.data) {
    const userB = userBasic.data
    return (
      <div className="text-left">
        <div>
          <p className="text-xs text-muted-foreground">Creado por: </p>
          <p className="font-bold text-xs text-muted-foreground">
            {userB.profile}
          </p>
          <p className="font-bold text-primary">{userB.description}</p>
        </div>
      </div>
    )
  }
}

function RouteComponent() {
  const { id } = Route.useParams()
  const { salesOperation } = useSalesOperation(+id)
  const { clients } = useClients()

  if (salesOperation.isLoading) {
    return (
      <span className="text-center h-full pt-10 text-primary">
        Cargando operación de venta...
      </span>
    )
  }

  if (salesOperation.isError) {
    return (
      <span className="text-center text-destructive h-full pt-10">
        Error cargando la operación de venta
      </span>
    )
  }

  if (salesOperation.data) {
    const data = salesOperation.data
    const client = clients.data?.find((c) => c.id === data.client_id)

    return (
      <div className=" mx-5 pb-10 space-y-6">
        <div className="mb-4 flex flex-col gap-2">
          <BreadcrumbMain
            main={`${data.document_no}`}
            routes={[{ to: '/sales', name: 'Ventas' }]}
          />
        </div>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-primary">
                {getOperationName(data.operation_type)} #{data.document_no}
              </h1>
              <Badge
                variant={data.pending ? 'secondary' : 'default'}
                className=" uppercase"
              >
                {data.pending ? 'PENDIENTE' : 'COMPLETADO'}
              </Badge>
            </div>
            <UserCreator id={data.user_id} />
            <div className="flex items-center text-muted-foreground text-sm gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(data.emission_date).toLocaleString('es-VE', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className=" text-primary border-primary">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir Recibo
            </Button>
            <Button className=" bg-primary text-primary-foreground">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className=" border-t-4 border-t-primary">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Total de Venta
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(data.total_net)}
              </p>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Impuestos
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(data.total_tax)}
              </p>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Total Artículos
              </p>
              <p className="text-3xl font-bold text-primary">
                {data.total_count_details} Items
              </p>
            </CardContent>
          </Card>
          <Card className="">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Términos
              </p>
              <p className="text-lg font-medium text-primary">
                Crédito: {data.credit_days} Días
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Client Info + Table) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info (Minimal due to payload constraints) */}
            <Card>
              <CardHeader className="border-b bg-secondary/20">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">ID</p>
                  <p className="font-medium text-primary">
                    {client?.client_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    DECRIPCIÓN
                  </p>
                  <p className="font-medium text-primary">
                    {client?.description}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    EMAIL
                  </p>
                  <p className="font-medium text-primary">{client?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Sales Details Table */}
            <Card className="">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-secondary/20 pb-4">
                <CardTitle className="text-sm font-semibold text-primary">
                  PARTIDAS DE VENTA
                </CardTitle>
                <Badge className="">
                  {data.total_count_details} LÍNEAS
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-primary font-semibold">
                        SKU
                      </TableHead>
                      <TableHead className="text-primary font-semibold">
                        Descripción
                      </TableHead>
                      <TableHead className="text-right text-primary font-semibold">
                        Cant.
                      </TableHead>
                      <TableHead className="text-right text-primary font-semibold">
                        Precio Unit.
                      </TableHead>
                      <TableHead className="text-right text-primary font-semibold">
                        Tax %
                      </TableHead>
                      <TableHead className="text-right text-primary font-semibold">
                        Subtotal
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.sales_operation_details &&
                      data.sales_operation_details.map((item) => (
                        <TableRow key={item.line}>
                          <TableCell className="font-medium">
                            PRD-{item.product_id.toString().padStart(3, '0')}
                          </TableCell>
                          <TableCell>{item.description_product}</TableCell>
                          <TableCell className="text-right">
                            {item.amount}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.sale_aliquot}%
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            <div className="flex">
              <Card className=" w-full bg-secondary/10">
                <CardContent className=" space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal Neto</span>
                    <span className="font-medium text-primary">
                      {formatCurrency(data.total_net)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impuestos</span>
                    <span className="font-medium text-primary">
                      {formatCurrency(data.total_tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Descuentos</span>
                    <span className="font-medium text-destructive">
                      -{formatCurrency(data.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-primary/20 pt-4 mt-4">
                    <span className="text-lg font-bold text-primary">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(data.total)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="text-center">
              <div className="mx-auto w-10 h-10 bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {data.seller.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vendedor</p>

                <p className="font-bold text-primary">{data.seller}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
