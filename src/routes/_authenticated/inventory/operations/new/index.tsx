import { createFileRoute } from '@tanstack/react-router'
import { OperationForm } from '../-components/OperationForm'

export const Route = createFileRoute(
  '/_authenticated/inventory/operations/new/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-5">
      <OperationForm />
    </div>
  )
}
