import { BreadcrumbMain } from '#/components/BreadcrumbMain'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { useInventoryMultiple } from '#/hook/useInventory'
import { useInventoryOperationDetails } from '#/hook/useInventoryOperation'
import { useUsers } from '#/hook/useUsers'
import type { InventoryOperationDetail } from '#/services/inventoryOperationService'
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  ClockCounterClockwiseIcon,
  FileTextIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/inventory/operations/$id/',
)({
  component: RouteComponent,
})

function TableRowsComponent({ iod }: { iod: InventoryOperationDetail[] }) {
  const { inventory } = useInventoryMultiple({
    ids: iod.map((p) => p.product_id),
    units: true,
  })
  if (inventory.isLoading) {
    return <>Cargando listado...</>
  }
  if (inventory.data)
    return (
      <>
        {inventory.data.map((detail, idx) => {
          const inventoryDetail = iod.find((r) => r.product_id === detail.id)
          const unit = detail.units.find((p) => p.id === inventoryDetail?.unit)
          return (
            <TableRow key={idx} className="hover:bg-slate-50/50">
              <TableCell className="font-mono text-xs text-slate-500">
                PRD-{detail.code}
              </TableCell>
              <TableCell className="font-medium text-slate-800">
                {detail.description || 'Producto Desconocido'}
              </TableCell>
              <TableCell className="text-right text-slate-600">
                {unit?.unit}
              </TableCell>
              <TableCell className="text-right font-medium text-slate-700">
                {inventoryDetail?.amount}
              </TableCell>
              <TableCell className="text-right text-slate-600">
                ${unit?.cost.toFixed(2) || '0.00'}
              </TableCell>
              <TableCell className="text-right font-semibold text-slate-900">
                ${inventoryDetail?.total.toFixed(2) || '0.00'}
              </TableCell>
            </TableRow>
          )
        })}
      </>
    )
}

function UserInfoComponent({ id }: { id: number }) {
  const { userBasic: OperationCreator } = useUsers(id)
  if (OperationCreator.isLoading) return <>Cargando usuario...</>
  if (OperationCreator.isError)
    return <span className="text-red-500">Error cargando usuario...</span>
  const oc = OperationCreator.data
  if (!oc)
    return (
      <span className="text-red-500">
        Error cargando los datos del responsable
      </span>
    )
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-50 text-blue-600">
          <UserIcon weight="bold" />
        </div>
        <span className="font-medium text-slate-800 text-sm truncate">
          {oc.profile} | {oc.description}
        </span>
      </div>
    </>
  )
}

function RouteComponent() {
  const { id } = Route.useParams()
  const { operationDetails } = useInventoryOperationDetails(Number(id))

  if (operationDetails.isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Cargando detalle de operación...
      </div>
    )
  }

  if (operationDetails.isError || !operationDetails.data) {
    return (
      <div className="p-8 text-center text-destructive">
        Error al cargar los detalles de la operación o no encontrada.
      </div>
    )
  }

  const op = operationDetails.data
  const documentRef = op.document_no

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
      .format(date)
      .replace(',', '')
  }

  const totalItems = op.inventory_operation_details.length || 0

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <BreadcrumbMain
        main={`${op.operation_type === 'LOAD' ? 'Carga' : 'Descarga'} - ${documentRef}`}
        routes={[
          {
            to: '/inventory',
            name: 'Inventario',
          },
          {
            to: '/inventory/operations',
            name: 'Operaciones de Inventario',
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Detalle de Operación: {documentRef}
            </h1>
            {/* <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 w-full sm:w-auto">
              <PrinterIcon className="w-4 h-4 mr-2" />
              Imprimir Comprobante
            </Button> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Tarjeta 1: Tipo */}
            <div className="bg-white p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Tipo de Operación
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 ${op.operation_type === 'LOAD' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                >
                  {op.operation_type === 'LOAD' ? (
                    <ArrowDownLeftIcon weight="bold" />
                  ) : (
                    <ArrowUpRightIcon weight="bold" />
                  )}
                </div>
                <span className="font-medium text-slate-800">
                  {op.operation_type === 'LOAD' ? 'Carga' : 'Descarga'}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Fecha y Hora
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-50 text-slate-500">
                  <CalendarBlankIcon weight="bold" />
                </div>
                <span className="font-medium text-slate-800 text-sm">
                  {formatDate(op.emission_date)}
                </span>
              </div>
            </div>

            <div className="bg-white p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Responsable
              </span>
              <UserInfoComponent id={op.user_id} />
            </div>

            <div className="bg-white p-4 border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ref. Documento
              </span>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600">
                  <FileTextIcon weight="bold" />
                </div>
                <span className="font-medium text-slate-800 text-sm truncate">
                  {documentRef}
                </span>
              </div>
            </div>
          </div>

          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-50 pb-4 pt-5 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800">
                Productos en Operación
              </CardTitle>
              <span className="text-sm text-slate-500">
                Total Items: {totalItems}
              </span>
            </CardHeader>
            <CardContent className="p-0 bg-white">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        SKU
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Producto
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                        Unidad
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                        Cantidad
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                        Costo Unitario
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                        Subtotal
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRowsComponent iod={op.inventory_operation_details} />
                    {totalItems === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-slate-400"
                        >
                          No hay productos registrados en esta operación.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col items-end justify-center gap-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Operación (Base)
                </span>
                <span className="text-3xl font-bold text-slate-900">
                  ${op.total.toFixed(2) || '0.00'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardHeader className="pb-4 pt-5 px-5 border-b border-slate-50">
              <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                Historial de Auditoría
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-5 space-y-6">
              <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-px before:bg-slate-200">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                  <CheckCircleIcon
                    weight="fill"
                    className="text-blue-500 w-3 h-3"
                  />
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  Operación Completada
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {formatDate(op.emission_date)}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Registrada en el sistema de manera exitosa.
                </p>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                  <ClockCounterClockwiseIcon
                    weight="fill"
                    className="text-slate-400 w-3 h-3"
                  />
                </div>
                <p className="text-xs font-medium text-slate-600">
                  Operación Iniciada
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {formatDate(op.emission_date)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cuadro de Observaciones */}
          <Card className="border-none shadow-sm bg-slate-50">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Observaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="text-sm text-slate-600 italic">
                {op.description
                  ? `"${op.description}"`
                  : '"No se registraron observaciones adicionales para esta operación."'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
