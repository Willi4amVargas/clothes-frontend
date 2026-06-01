import { createFileRoute } from '@tanstack/react-router'
import { TransactionArea } from './-components/TransactionArea'
import { CheckoutSidebar } from './-components/CheckoutSidebar'

export const Route = createFileRoute('/_authenticated/sales/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="mx-5 mt-5 h-[calc(100vh-6rem)]">
      <div className="flex gap-3 h-full">
        <div className="w-[70%]">
          <TransactionArea />
        </div>
        <div className="w-[30%]">
          <CheckoutSidebar />
        </div>
      </div>
    </div>
  )
}
