import { createFileRoute, Link } from '@tanstack/react-router'
import { OperationsList } from './-components/OperationsList'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Filter,
  ArrowUp,
  ArrowDown,
  CircleDollarSign,
  CalendarDays,
} from 'lucide-react'
import { BreadcrumbMain } from '#/components/BreadcrumbMain'

export const Route = createFileRoute('/_authenticated/inventory/operations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-5 space-y-6 min-h-screen bg-slate-50">
      {/* A. Barra Superior (Header) */}
      <div className="flex justify-between items-center">
        <div>
          <BreadcrumbMain
            main="Operaciones de Inventario"
            routes={[
              {
                to: '/inventory',
                name: 'Inventario',
              },
            ]}
          />
          <h1 className="text-2xl font-bold text-slate-900">
            Operaciones de Inventario
          </h1>
        </div>

        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          <Link to="/inventory/operations/new">
            <Plus className="h-4 w-4" /> Nueva Operación
          </Link>
        </Button>
      </div>

      {/* B. Barra de Filtros */}
      <div className="bg-white p-4 border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 block">
            Tipo de Operación
          </label>
          <select className="w-full text-sm bg-white border border-gray-200 p-2.5 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Todos los tipos</option>
            <option value="LOAD">Cargas</option>
            <option value="DOWNLOAD">Descargas</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 block">
            Rango de Fecha
          </label>
          <div className="relative">
            <CalendarDays className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="01/10/2023 - 31/10/2023"
              className="w-full text-sm bg-white border border-gray-200 py-2.5 pr-2.5 pl-9 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 gap-2 h-10.5"
        >
          <Filter className="h-4 w-4 text-gray-500" /> Filtrar
        </Button>
      </div>

      {/* C. Grid de Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 border border-gray-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
              Cargas (Hoy)
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">24</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              +12% vs ayer
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <ArrowUp className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 border border-gray-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
              Descargas (Hoy)
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">18</h3>
            <p className="text-xs text-rose-600 font-medium mt-1">
              -5% vs ayer
            </p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <ArrowDown className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 border border-gray-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
              Valor Total Movido
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">€45.2k</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Últimas 24h
            </p>
          </div>
          <div className="p-3 bg-gray-50 text-gray-600 rounded-lg">
            <CircleDollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* D. Tabla Principal de Datos */}
      <div className="mt-4">
        <OperationsList />
      </div>
    </div>
  )
}
