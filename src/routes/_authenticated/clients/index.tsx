import { Button } from '#/components/ui/button'
import { PlusIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ClientTable } from './-components/ClientTable'
import { ClientDetailsPanel } from './-components/ClientDetailsPanel'

type ClientStatus = 'Active' | 'On Hold' | 'Inactive'

interface Client {
  code: string
  description: string
  city: string
  creditLimit: number
  currentBalance: number
  status: ClientStatus
}

export const Route = createFileRoute('/_authenticated/clients/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  return (
    <div className="mx-5">
      <div className="mb-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Client Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage corporate accounts and credit terms.
          </p>
        </div>
        <Button className="hover:bg-primary bg-primary/80 my-auto" asChild>
          <Link to="/clients/new">
            <PlusIcon /> New Client
          </Link>
        </Button>
      </div>
      <div className="flex gap-3 h-[calc(100vh-10rem)]">
        <div className="w-[70%]">
          <ClientTable
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
          />
        </div>
        <div className="w-[30%]">
          <ClientDetailsPanel client={selectedClient} />
        </div>
      </div>
    </div>
  )
}
