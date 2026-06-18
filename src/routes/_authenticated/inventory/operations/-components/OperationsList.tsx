import { useInventoryOperations } from '#/hook/useInventoryOperation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Link } from '@tanstack/react-router'
import { EyeIcon, ChevronLeft, ChevronRight } from 'lucide-react'

export function OperationsList() {
  const { operations } = useInventoryOperations()

  if (operations.isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Cargando operaciones...
      </div>
    )
  }

  if (operations.isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Error al cargar las operaciones.
      </div>
    )
  }

  const data = operations.data || []

  // Formatting utility
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    const formatter = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    return formatter.format(d).replace(',', '')
  }

  return (
    <div className="border border-gray shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto border-t border-gray-50">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="font-semibold">No Documento</TableHead>
              <TableHead className="font-semibold">Fecha y Hora</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
              <TableHead className="font-semibold">Descripción</TableHead>
              <TableHead className="font-semibold text-right">Items</TableHead>
              <TableHead className="font-semibold text-right">Total</TableHead>
              <TableHead className="font-semibold text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-400"
                >
                  No se encontraron operaciones.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-sky-900 font-semibold whitespace-nowrap">
                    {item.document_no || `#${item.id}`}
                  </TableCell>
                  <TableCell className="text-gray-600 whitespace-nowrap">
                    {formatDate(item.emission_date)}
                  </TableCell>
                  <TableCell>
                    {item.operation_type === 'LOAD' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        Carga
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                        Descarga
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-62.5 whitespace-normal wrap-break-word">
                    {item.description || '-'}
                  </TableCell>
                  <TableCell className="text-right text-gray-600 whitespace-nowrap">
                    {item.total_amount || 0}
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-700 whitespace-nowrap">
                    ${item.total.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                      <Link
                        to="/inventory/operations/$id"
                        params={{ id: item.id.toString() }}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* E. Footer de la Tabla (Paginación estática de visual) */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-100 text-sm text-gray-500 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Filas por página:</span>
            <select className="border border-gray-200 rounded p-1 text-gray-700 bg-white outline-none">
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <span className="hidden sm:inline">1-{Math.min(20, data.length)} de {data.length || 156} resultados</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0 bg-blue-900 text-white hover:bg-blue-800 hover:text-white">1</Button>
          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500">2</Button>
          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500">3</Button>
          <span className="px-2 text-gray-400">...</span>
          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500">8</Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
