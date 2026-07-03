import { useState } from 'react'
import {
  ClockIcon,
  MapPinIcon,
  MoneyIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  PercentIcon,
  CalendarBlankIcon,
  NotePencilIcon,
} from '@phosphor-icons/react'

import { CardTitle } from '@/components/ui/card'
import type { Client } from '#/services/clientService'
import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'
import { useClientReports } from '#/hook/useReports'
import type { ClientSales } from '#/services/reportsService'

interface ClientDetailsPanelProps {
  client: Client | null
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const operationNodeColors: Record<ClientSales['operation_type'], string> = {
  SALE: 'bg-green-500',
  QUOTATION: 'bg-blue-500',
  ORDER: 'bg-amber-500',
}

// Mapeo de etiquetas legibles
const operationLabels: Record<ClientSales['operation_type'], string> = {
  SALE: 'Venta',
  QUOTATION: 'Cotización',
  ORDER: 'Pedido',
}

export function ClientSalesList({ id }: { id: number }) {
  const { clientSales } = useClientReports(id)

  if (clientSales.isLoading) {
    return (
      <div className="text-xs text-gray-500">Cargando listado de ventas...</div>
    )
  }

  if (clientSales.isError || !clientSales.data) {
    return (
      <div className="text-xs text-red-500">Error al cargar las ventas.</div>
    )
  }

  // Validar si la respuesta es el objeto de mensaje o está vacío
  if ('message' in clientSales.data) {
    return (
      <div className="text-xs text-gray-500">{clientSales.data.message}</div>
    )
  }

  const operations = clientSales.data

  if (operations.length === 0) {
    return (
      <div className="text-xs text-gray-500">
        No hay operaciones registradas para este cliente.
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {operations.map((op, index) => (
        <div key={op.id} className="flex gap-3">
          {/* Línea de tiempo / Nodo */}
          <div className="flex flex-col items-center">
            <div
              className={`h-2 w-2 rounded-full ${operationNodeColors[op.operation_type] || 'bg-gray-400'} mt-1.5 shrink-0`}
            />
            {index < operations.length - 1 && (
              <div className="w-px h-full bg-gray-100 my-1" />
            )}
          </div>

          {/* Contenido de la operación */}
          <div className="pb-3.5 flex-1 min-w-0 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                {operationLabels[op.operation_type]} ({op.document_no})
              </span>
              {/* Puedes cambiar el icono o color si está 'pending' */}
              <ClockIcon
                className={`h-3 w-3 shrink-0 ${op.pending ? 'text-amber-500' : 'text-gray-400'}`}
              />
            </div>

            <div className="flex items-center justify-between mt-0.5 text-gray-500">
              {/* Formateo simple a moneda (ajusta el locale según tu país) */}
              <span>
                {new Intl.NumberFormat('es-VE', {
                  style: 'currency',
                  currency: 'USD',
                }).format(op.total)}
              </span>
              <span className="text-[10px] text-gray-400">
                {new Date(op.emission_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ClientDetailsPanel({ client }: ClientDetailsPanelProps) {
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    contactInfo: false,
    creditSettings: false,
    recentOperations: false,
  })

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  if (!client) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 ring-1 ring-foreground/10 p-6 text-center">
        <MoneyIcon className="h-12 w-12 mb-3 text-gray-300" />
        <p className="text-sm font-medium text-gray-600">Select a client</p>
        <p className="text-xs mt-1 text-gray-400 max-w-[240px]">
          Choose a client from the directory to view account details and terms
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white ring-1 ring-foreground/10 overflow-auto">
      {/* 1. Header de Perfil Principal */}
      <div className="px-4 py-4 border-b bg-gray-50/30">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
            {client.code}
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            ID: {client.client_id}
          </span>
          <Button variant={'link'} asChild>
            <Link to="/clients/$id" params={{ id: `${client.id}` }}>
              Details <NotePencilIcon />
            </Link>
          </Button>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {client.description}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPinIcon className="h-3.5 w-3.5 text-gray-400" />
          <span>
            {client.city}, {client.country}
          </span>
        </div>
      </div>

      {/* 2. Resumen Financiero Real */}
      <div className="px-4 py-4 border-b">
        <CardTitle className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          Financial Overview
        </CardTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50/60 p-3 rounded-lg border border-gray-100">
            <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1">
              <MoneyIcon className="h-3.5 w-3.5 text-gray-400" /> Credit Limit
            </p>
            <p className="text-base font-bold text-gray-900">
              {formatCurrency(client.credit_limit)}
            </p>
          </div>
          <div className="bg-gray-50/60 p-3 rounded-lg border border-gray-100">
            <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1">
              <PercentIcon className="h-3.5 w-3.5 text-gray-400" /> Base
              Discount
            </p>
            <p className="text-base font-bold text-gray-900">
              {client.discount}%
            </p>
          </div>
        </div>
      </div>

      {/* 3. Información de Contacto (Campos nuevos traídos de la API) */}
      <div className="px-4 py-3 border-b">
        <button
          className="flex items-center justify-between w-full mb-2"
          onClick={() => toggleSection('contactInfo')}
        >
          <CardTitle className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Contact Details
          </CardTitle>
          <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            {collapsedSections.contactInfo ? 'Expand' : 'Collapse'}
          </span>
        </button>
        {!collapsedSections.contactInfo && (
          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-2.5 text-xs">
              <EnvelopeSimpleIcon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <div className="min-w-0 break-all">
                <p className="text-gray-500 text-[10px]">Email Address</p>
                <a
                  href={`mailto:${client.email}`}
                  className="text-gray-900 font-medium hover:underline"
                >
                  {client.email || 'N/A'}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <PhoneIcon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-500 text-[10px]">Phone Number</p>
                <span className="text-gray-900 font-medium">
                  {client.phone || 'N/A'}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPinIcon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-500 text-[10px]">Street Address</p>
                <span className="text-gray-900 font-medium text-balance">
                  {client.address || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Parámetros de Crédito */}
      <div className="px-4 py-3 border-b">
        <button
          className="flex items-center justify-between w-full mb-2"
          onClick={() => toggleSection('creditSettings')}
        >
          <CardTitle className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Credit Terms
          </CardTitle>
          <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            {collapsedSections.creditSettings ? 'Expand' : 'Collapse'}
          </span>
        </button>
        {!collapsedSections.creditSettings && (
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-gray-600">Payment Window</span>
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                <CalendarBlankIcon className="h-3.5 w-3.5 text-gray-400" />
                Net {client.credit_days} Days
              </span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-gray-600">Risk Profile assessment</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    client.credit_days > 60
                      ? 'bg-amber-500'
                      : client.credit_days > 90
                        ? 'bg-red-500'
                        : 'bg-emerald-500'
                  }`}
                />
                <span className="font-semibold text-gray-900">
                  {client.credit_days > 60 ? 'Extended' : 'Standard'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 flex-1">
        <button
          className="flex items-center justify-between w-full mb-3"
          onClick={() => toggleSection('recentOperations')}
        >
          <CardTitle className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Recent Activity
          </CardTitle>
          <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            {collapsedSections.recentOperations ? 'Expand' : 'Collapse'}
          </span>
        </button>
        {!collapsedSections.recentOperations && (
          <ClientSalesList id={client.id} />
        )}
      </div>
    </div>
  )
}
