import { useCart } from './CartContext'
import { Button } from '#/components/ui/button'
import { CheckCircleIcon, PrinterIcon, ArrowLeftIcon, FileTextIcon } from '@phosphor-icons/react'

export function OrderSuccess() {
  const { orderData, setCurrentView } = useCart()

  if (!orderData) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-[800px] mx-auto px-10 py-12">
      {/* Success banner */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 border border-green-200 shadow-sm">
          <CheckCircleIcon size={36} weight="fill" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Order Transmission Succeeded</h1>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Order <span className="font-mono font-bold text-primary">{orderData.orderNumber}</span> has been verified and queued for shipping. An invoice copy has been dispatched to your account registry.
          </p>
        </div>
      </div>

      {/* Invoice Details Layout */}
      <div className="bg-surface-container-lowest border border-outline rounded-[4px] shadow-xs overflow-hidden">
        
        {/* Invoice Title & Meta */}
        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Procurement Receipt</div>
            <div className="text-sm font-bold text-on-surface font-mono">{orderData.orderNumber}</div>
          </div>
          <div className="text-left sm:text-right text-[11px] font-mono text-on-surface-variant space-y-0.5">
            <div>Date: {orderData.date}</div>
            <div>Ref: {orderData.transactionRef}</div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="p-6 border-b border-outline-variant grid sm:grid-cols-2 gap-6 text-xs leading-relaxed">
          {/* Shipping Address */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-on-surface uppercase tracking-wide text-[10px] text-on-surface-variant">Logistics Destination</h4>
            <div className="font-semibold text-on-surface">{orderData.shipping.companyName}</div>
            <div className="text-on-surface-variant">
              Tax ID: <span className="font-mono">{orderData.shipping.taxId}</span>
            </div>
            <div className="text-on-surface-variant/90">
              {orderData.shipping.address}
              {orderData.shipping.facility && `, ${orderData.shipping.facility}`}
              <br />
              {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}
              <br />
              {orderData.shipping.country}
            </div>
            <div className="text-[11px] text-on-surface-variant">
              Attn: <span className="font-semibold">{orderData.shipping.contactPerson}</span> ({orderData.shipping.phone})
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="font-bold text-on-surface uppercase tracking-wide text-[10px] text-on-surface-variant">Procurement Terms</h4>
              <div className="font-semibold text-on-surface">{orderData.payment.method}</div>
              <div className="text-on-surface-variant font-mono text-[11px]">{orderData.payment.reference}</div>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-on-surface uppercase tracking-wide text-[10px] text-on-surface-variant">Transit Speed</h4>
              <div className="font-semibold text-on-surface">{orderData.deliveryEstimate}</div>
            </div>
          </div>
        </div>

        {/* Itemised Breakdown Table */}
        <div className="p-6 border-b border-outline-variant space-y-4">
          <h4 className="font-bold text-on-surface uppercase tracking-wide text-[10px] text-on-surface-variant">Itemized SKU Specifications</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/60 font-semibold text-on-surface-variant uppercase tracking-wider text-[9px] pb-2">
                  <th className="py-2">Part Number / SKU</th>
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item: any) => (
                  <tr key={item.id} className="border-b border-outline-variant/30 text-on-surface-variant">
                    <td className="py-3 font-mono font-semibold text-on-surface">{item.sku}</td>
                    <td className="py-3">
                      <div className="font-semibold text-on-surface">{item.title}</div>
                      <div className="text-[10px] text-on-surface-variant/80 uppercase font-light">{item.brand}</div>
                    </td>
                    <td className="py-3 text-right font-mono">${item.price.toFixed(2)}</td>
                    <td className="py-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 text-right font-mono font-semibold text-on-surface">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="p-6 bg-surface-container-low flex justify-end">
          <div className="w-full max-w-[280px] space-y-2 text-xs leading-none">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-mono">${orderData.totals.subtotal.toFixed(2)}</span>
            </div>
            {orderData.totals.bulkDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Volume Discount (5%)</span>
                <span className="font-mono">-${orderData.totals.bulkDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-on-surface-variant">
              <span>Logistics (Freight)</span>
              <span className="font-mono">${orderData.totals.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Estimated Sales Tax</span>
              <span className="font-mono">${orderData.totals.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-outline pt-3.5 flex justify-between text-sm font-bold text-on-surface">
              <span>Net Invoiced</span>
              <span className="font-mono text-primary text-base">${orderData.totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <button 
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-primary/95 transition-colors uppercase tracking-wider py-2"
        >
          <PrinterIcon size={16} />
          Print Contract Invoice
        </button>

        <div className="flex gap-3">
          <Button 
            onClick={() => setCurrentView('shop')}
            className="bg-primary text-primary-foreground font-semibold h-10 rounded-[4px] text-xs uppercase tracking-wider px-6 flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors"
          >
            <ArrowLeftIcon size={14} />
            Return to Catalog
          </Button>
          <Button 
            variant="outline" 
            className="border-outline text-secondary hover:text-primary font-semibold h-10 rounded-[4px] text-xs uppercase tracking-wider px-6"
          >
            <FileTextIcon size={14} className="mr-1.5" />
            CAD Models (.STEP)
          </Button>
        </div>
      </div>
    </div>
  )
}
