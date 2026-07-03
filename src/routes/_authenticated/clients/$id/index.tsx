import { BreadcrumbMain } from '#/components/BreadcrumbMain'
import { createFileRoute } from '@tanstack/react-router'
import { ClientForm } from '../-components/ClientForm'
import { useClient, useClients } from '#/hook/useClient'

export const Route = createFileRoute('/_authenticated/clients/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { client } = useClient(+id)
  const { updateClient } = useClients()
  const navigate = Route.useNavigate()
  return (
    <div className="mx-5">
      <BreadcrumbMain
        main={`Actualizar cliente ${id}`}
        routes={[
          {
            to: '/clients',
            name: 'Clientes',
          },
        ]}
      />
      <ClientForm
        initialValues={client.data}
        onSave={(e) => updateClient.mutate({ id: +id, body: e, dryRun: false })}
        onCancel={() => navigate({ from: '/clients/' })}
      />
    </div>
  )
}
