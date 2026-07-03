import { useState, useMemo } from 'react'
import {
  DownloadSimpleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Client } from '#/services/clientService'
import { useClients } from '#/hook/useClient'

interface ClientTableProps {
  selectedClient: Client | null
  onSelectClient: (client: Client) => void
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function ClientTable({
  selectedClient,
  onSelectClient,
}: ClientTableProps) {
  const { clients } = useClients()
  const clientData = clients.data ?? []
  const isLoading = clients.isLoading
  const isError = clients.isError

  const [searchTerm, setSearchTerm] = useState('')
  const [cityFilter, setCityFilter] = useState('All Cities')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const cities = useMemo(() => {
    const uniqueCities = new Set(clientData.map((c) => c.city).filter(Boolean))
    return ['All Cities', ...Array.from(uniqueCities)]
  }, [clientData])

  const filteredData = useMemo(() => {
    return clientData.filter((client) => {
      const matchesSearch =
        searchTerm === '' ||
        Object.values(client).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        )
      const matchesCity =
        cityFilter === 'All Cities' || client.city === cityFilter

      return matchesSearch && matchesCity
    })
  }, [clientData, searchTerm, cityFilter])

  // 5. Lógica de Paginación
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    )
  }, [filteredData, currentPage, pageSize])

  const startEntry =
    filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, filteredData.length)

  return (
    <div className="flex flex-col h-full ring-1 ring-foreground/10 bg-white">
      {/* barra superior de filtros */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
        <div className="relative grow max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search clients..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Resetea a la primera página al buscar
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={cityFilter}
            onValueChange={(val) => {
              setCityFilter(val)
              setCurrentPage(1) // Resetea a la primera página al filtrar
            }}
          >
            <SelectTrigger className="h-7 text-xs w-32">
              <FunnelIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Button variant="outline" size="sm" className="h-7 gap-1.5">
            <DownloadSimpleIcon className="h-3.5 w-3.5" />
            Export
          </Button> */}
        </div>
      </div>

      {/* contenedor de la tabla con estados de carga */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900 w-24">
                Code
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-900 w-32">
                City
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right w-32">
                Credit Limit
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right w-32">
                Credit Days
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-center w-28">
                Discount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading clients...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-red-500 font-medium"
                >
                  Error loading client data.
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((client) => (
                <TableRow
                  key={client.id}
                  className={`cursor-pointer ${
                    selectedClient?.id === client.id
                      ? 'bg-primary/5 hover:bg-primary/5'
                      : ''
                  }`}
                  onClick={() => onSelectClient(client)}
                >
                  <TableCell className="font-mono text-xs text-gray-600">
                    {client.code}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {client.description}
                  </TableCell>
                  <TableCell className="text-gray-600">{client.city}</TableCell>
                  <TableCell className="text-right text-gray-700">
                    {formatCurrency(client.credit_limit)}
                  </TableCell>
                  <TableCell className="text-right text-gray-700 font-medium">
                    {client.credit_days} days
                  </TableCell>
                  <TableCell className="text-center">
                    {client.discount > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                      >
                        {client.discount}%
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* paginación inferior */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50/50">
        <span className="text-xs text-gray-600">
          Showing {startEntry} to {endEntry} of {filteredData.length} entries
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            disabled={currentPage === 1 || isLoading}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              className="h-7 w-7 p-0"
              disabled={isLoading}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            disabled={currentPage === totalPages || isLoading}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
