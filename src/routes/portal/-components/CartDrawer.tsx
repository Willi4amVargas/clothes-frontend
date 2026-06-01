import { XIcon, PlusIcon, MinusIcon, TrashIcon, ShoppingCartSimpleIcon } from '@phosphor-icons/react'
import { Button } from '#/components/ui/button'
import { useCart } from './CartContext'

export function CartDrawer() {
  const { 
    cartItems, 
    cartDrawerOpen, 
    setCartDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    setCurrentView 
  } = useCart()

  if (!cartDrawerOpen) return null

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleCheckoutClick = () => {
    setCartDrawerOpen(false)
    setCurrentView('checkout')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <ShoppingCartSimpleIcon size={20} className="text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">
              Procurement Cart
            </h2>
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <button 
            onClick={() => setCartDrawerOpen(false)}
            className="p-1 rounded-[2px] text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-container-lowest">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant/40">
                <ShoppingCartSimpleIcon size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-on-surface">Your cart is empty</p>
                <p className="text-[11px] text-on-surface-variant/80">Add industrial components to begin procurement.</p>
              </div>
              <Button 
                onClick={() => setCartDrawerOpen(false)}
                variant="outline" 
                size="sm"
                className="mt-2 text-xs border-outline text-primary rounded-[4px]"
              >
                Browse Catalog
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-3 p-3 rounded-[4px] border border-outline-variant bg-surface-container-lowest hover:border-primary/45 hover:shadow-xs transition-all"
              >
                {/* 1:1 Image Placeholder */}
                <div className="w-16 h-16 bg-surface-container-low rounded-[2px] border border-outline-variant/60 flex items-center justify-center shrink-0">
                  <div className="w-10 h-10 border border-dashed border-outline/40 flex items-center justify-center rounded-[1px] bg-surface-container-lowest">
                    <span className="text-[9px] font-mono text-outline/80">1:1</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-on-surface truncate hover:text-primary transition-colors cursor-pointer" title={item.title}>
                        {item.title}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-on-surface-variant/60 hover:text-error transition-colors p-0.5"
                        title="Remove item"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant/80">
                      <span>SKU: {item.sku}</span>
                      <span className={item.status === 'In Stock' ? 'text-green-600' : 'text-amber-600'}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Actions & Price */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-outline-variant rounded-[4px] bg-surface-container-low h-7 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 h-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center"
                      >
                        <MinusIcon size={10} />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-on-surface font-mono w-8 text-center bg-surface-container-lowest h-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 h-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors flex items-center justify-center"
                      >
                        <PlusIcon size={10} />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-on-surface font-mono">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-on-surface-variant/60 font-mono">
                        ${item.price.toFixed(2)} ea
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary Container */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-outline-variant bg-surface-container-low space-y-4 shadow-inner">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal ({totalItems} units)</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Freight (Logistics)</span>
                <span className="font-mono text-green-600 font-semibold">TBD at Checkout</span>
              </div>
              <div className="border-t border-outline-variant/60 my-2 pt-2 flex justify-between text-sm font-bold text-on-surface">
                <span>Total Est.</span>
                <span className="font-mono text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleCheckoutClick}
                className="w-full bg-primary text-primary-foreground font-semibold h-10 rounded-[4px] uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors"
              >
                Proceed to Checkout
              </Button>
              <button 
                onClick={() => setCartDrawerOpen(false)}
                className="w-full text-center text-xs font-bold text-primary hover:text-primary/90 transition-colors uppercase tracking-wider py-1.5"
              >
                Continue Purchasing
              </button>
            </div>

            <div className="text-[10px] text-center text-on-surface-variant/60 border-t border-outline-variant/40 pt-3">
              Corporate terms (Net-30) and customs forms will apply.
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
