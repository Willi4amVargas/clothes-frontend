import {
  ArrowsDownUpIcon,
  DownloadSimpleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react'

import { Badge } from '@/components/ui/badge'
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
import { useMemo, useState } from 'react'

type ClientStatus = 'Active' | 'On Hold' | 'Inactive'

interface Client {
  code: string
  description: string
  city: string
  creditLimit: number
  currentBalance: number
  status: ClientStatus
}

const clients: Client[] = [
  {
    code: 'CLI-8092',
    description: 'Acme Corporation Ltd.',
    city: 'New York',
    creditLimit: 50000,
    currentBalance: 36500,
    status: 'Active',
  },
  {
    code: 'CLI-7741',
    description: 'Global Textiles Inc.',
    city: 'Los Angeles',
    creditLimit: 75000,
    currentBalance: 12300,
    status: 'Active',
  },
  {
    code: 'CLI-6203',
    description: 'Meridian Fashion Group',
    city: 'Chicago',
    creditLimit: 100000,
    currentBalance: 89750,
    status: 'On Hold',
  },
  {
    code: 'CLI-5118',
    description: 'Pacific Retail Partners',
    city: 'San Francisco',
    creditLimit: 60000,
    currentBalance: 0,
    status: 'Active',
  },
  {
    code: 'CLI-4920',
    description: 'Sterling Apparel Co.',
    city: 'Dallas',
    creditLimit: 40000,
    currentBalance: 38200,
    status: 'Inactive',
  },
]

const StatusBadge = ({ status }: { status: ClientStatus }) => {
  switch (status) {
    case 'Active':
      return (
        <Badge
          variant="secondary"
          className="bg-[#D1FAE5] text-[#166534] font-medium text-xs px-2.5 py-0 hover:bg-[#D1FAE5]/80"
        >
          Active
        </Badge>
      )
    case 'On Hold':
      return (
        <Badge
          variant="secondary"
          className="bg-[#FEF3C7] text-[#92400E] font-medium text-xs px-2.5 py-0 hover:bg-[#FEF3C7]/80"
        >
          On Hold
        </Badge>
      )
    case 'Inactive':
      return (
        <Badge
          variant="outline"
          className="bg-[#F3F4F6] text-[#6B7280] font-medium text-xs px-2.5 py-0 border-none hover:bg-[#F3F4F6]/80"
        >
          Inactive
        </Badge>
      )
  }
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface ClientTableProps {
  selectedClient: Client | null
  onSelectClient: (client: Client) => void
}

export function ClientTable({
  selectedClient,
  onSelectClient,
}: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [cityFilter, setCityFilter] = useState('All Cities')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const cities = useMemo(
    () => ['All Cities', ...new Set(clients.map((c) => c.city))],
    [],
  )

  const filteredData = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        searchTerm === '' ||
        Object.values(client).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        )
      const matchesCity =
        cityFilter === 'All Cities' || client.city === cityFilter
      const matchesStatus =
        statusFilter === 'All Status' || client.status === statusFilter
      return matchesSearch && matchesCity && matchesStatus
    })
  }, [searchTerm, cityFilter, statusFilter])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const startEntry = (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(currentPage * pageSize, filteredData.length)

  const isBalanceCritical = (client: Client) => {
    const utilization = client.currentBalance / client.creditLimit
    return utilization > 0.7
  }

  return (
    <div className="flex flex-col h-full ring-1 ring-foreground/10 bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
        <div className="relative grow max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search clients..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={cityFilter} onValueChange={setCityFilter}>
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-7 text-xs w-32">
              <ArrowsDownUpIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Status">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-7 gap-1.5">
            <DownloadSimpleIcon className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

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
                Current Balance
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-center w-28">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((client) => (
              <TableRow
                key={client.code}
                className={`cursor-pointer ${selectedClient?.code === client.code ? 'bg-primary/5 hover:bg-primary/5' : ''}`}
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
                  {formatCurrency(client.creditLimit)}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${isBalanceCritical(client) ? 'text-[#DC2626]' : 'text-gray-700'}`}
                >
                  {formatCurrency(client.currentBalance)}
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={client.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50/50">
        <span className="text-xs text-gray-600">
          Showing {startEntry} to {endEntry} of {filteredData.length} entries
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="xs"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="xs"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="xs"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
