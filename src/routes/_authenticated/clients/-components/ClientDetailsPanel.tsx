import {
  ClockIcon,
  MapPinIcon,
  MoneyIcon,
  TrendUpIcon,
} from '@phosphor-icons/react'

import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

type ClientStatus = 'Active' | 'On Hold' | 'Inactive'

interface Client {
  code: string
  description: string
  city: string
  creditLimit: number
  currentBalance: number
  status: ClientStatus
}

interface OperationEntry {
  id: string
  type: 'invoice' | 'payment' | 'credit_note' | 'hold'
  label: string
  amount: string
  timestamp: string
}

const operations: OperationEntry[] = [
  {
    id: 'op-1',
    type: 'invoice',
    label: 'Invoice Issued',
    amount: '$12,450.00',
    timestamp: '2026-05-02 14:30',
  },
  {
    id: 'op-2',
    type: 'payment',
    label: 'Payment Received',
    amount: '$8,200.00',
    timestamp: '2026-04-28 09:15',
  },
  {
    id: 'op-3',
    type: 'invoice',
    label: 'Invoice Issued',
    amount: '$5,780.00',
    timestamp: '2026-04-25 16:45',
  },
  {
    id: 'op-4',
    type: 'credit_note',
    label: 'Credit Note Applied',
    amount: '$1,350.00',
    timestamp: '2026-04-20 11:00',
  },
  {
    id: 'op-5',
    type: 'payment',
    label: 'Payment Received',
    amount: '$15,000.00',
    timestamp: '2026-04-15 08:22',
  },
]

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface ClientDetailsPanelProps {
  client: Client | null
}

const operationNodeColors: Record<OperationEntry['type'], string> = {
  invoice: 'bg-[#3B82F6]',
  payment: 'bg-[#10B981]',
  credit_note: 'bg-[#8B5CF6]',
  hold: 'bg-[#F59E0B]',
}

export function ClientDetailsPanel({ client }: ClientDetailsPanelProps) {
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    creditSettings: false,
    recentOperations: false,
  })

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  if (!client) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 ring-1 ring-foreground/10">
        <MoneyIcon className="h-12 w-12 mb-3 text-gray-300" />
        <p className="text-sm font-medium">Select a client</p>
        <p className="text-xs mt-1">
          Choose a client from the directory to view account details
        </p>
      </div>
    )
  }

  const utilizationPercent = Math.round(
    (client.currentBalance / client.creditLimit) * 100,
  )
  const isHighUtilization = utilizationPercent > 70

  return (
    <div className="h-full flex flex-col bg-white ring-1 ring-foreground/10 overflow-auto">
      {/* Profile Header */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-gray-500">{client.code}</span>
          <Badge
            variant="secondary"
            className={`text-xs px-2 py-0 ${client.status === 'Active' ? 'bg-[#D1FAE5] text-[#166534]' : client.status === 'On Hold' ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}
          >
            {client.status}
          </Badge>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
          {client.description}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPinIcon className="h-3.5 w-3.5" />
          <span>{client.city}</span>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="px-4 py-3 border-b">
        <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Financial Overview
        </CardTitle>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Current Balance</p>
            <p
              className={`text-lg font-bold ${isHighUtilization ? 'text-[#DC2626]' : 'text-gray-900'}`}
            >
              {formatCurrency(client.currentBalance)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {utilizationPercent}% of limit utilized
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">YTD Sales</p>
            <p className="text-lg font-bold text-gray-900">$284,320</p>
            <div className="flex items-center gap-1 mt-0.5">
              <TrendUpIcon className="h-3 w-3 text-[#10B981]" />
              <span className="text-xs text-[#10B981] font-medium">+12.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Settings */}
      <div className="px-4 py-3 border-b">
        <button
          className="flex items-center justify-between w-full mb-2"
          onClick={() => toggleSection('creditSettings')}
        >
          <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Credit Settings
          </CardTitle>
          <span className="text-xs text-gray-400">
            {collapsedSections.creditSettings ? 'Expand' : 'Collapse'}
          </span>
        </button>
        {!collapsedSections.creditSettings && (
          <div className="space-y-0">
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-600">Credit Limit</span>
              <span className="text-xs font-semibold text-gray-900">
                {formatCurrency(client.creditLimit)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-600">Payment Terms</span>
              <span className="text-xs font-semibold text-gray-900">
                Net 30
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-600">Risk Rating</span>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${utilizationPercent > 80 ? 'bg-[#DC2626]' : utilizationPercent > 60 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`}
                />
                <span className="text-xs font-semibold text-gray-900">
                  {utilizationPercent > 80
                    ? 'High'
                    : utilizationPercent > 60
                      ? 'Medium'
                      : 'Low'}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-600">Auto-Hold Threshold</span>
              <span className="text-xs font-semibold text-gray-900">90%</span>
            </div>
          </div>
        )}
      </div>

      {/* Recent Operations Timeline */}
      <div className="px-4 py-3 flex-1">
        <button
          className="flex items-center justify-between w-full mb-3"
          onClick={() => toggleSection('recentOperations')}
        >
          <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Recent Operations
          </CardTitle>
          <span className="text-xs text-gray-400">
            {collapsedSections.recentOperations ? 'Expand' : 'Collapse'}
          </span>
        </button>
        {!collapsedSections.recentOperations && (
          <div className="space-y-0">
            {operations.map((op, index) => (
              <div key={op.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${operationNodeColors[op.type]} mt-1.5 shrink-0`}
                  />
                  {index < operations.length - 1 && (
                    <div className="w-px h-full bg-gray-200 my-1" />
                  )}
                </div>
                <div className="pb-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900">
                      {op.label}
                    </span>
                    <ClockIcon className="h-3 w-3 text-gray-400 shrink-0" />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-gray-500">{op.amount}</span>
                    <span className="text-xs text-gray-400">
                      {op.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
