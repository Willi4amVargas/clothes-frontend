import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog"
import { HeartIcon, MinusIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { useFavorites } from "./FavoriteContext"
import { Button } from "#/components/ui/button"

export function FavoritesDialog() {
  const {
    favoriteItems,
    favoriteModalOpen,
    setFavoriteModalOpen,
    updateQuantity,
    removeFromFavorites,
    clearFavorites,
  } = useFavorites()

  const totalItems = favoriteItems.reduce((acc, item) => acc + item.quantity, 0)
  const totalValue = favoriteItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <Dialog open={favoriteModalOpen} onOpenChange={setFavoriteModalOpen} >
      <DialogContent className="sm:max-w-xl bg-surface-container-lowest border-outline-variant shadow-2xl p-0 overflow-hidden flex flex-col max-h-[85vh] rounded-[8px]" showCloseButton={false}>
        
        {/* Header del Dialog */}
        <DialogHeader className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-row items-center justify-between space-y-0" >
          <div className="flex items-center gap-2">
            <HeartIcon size={20} className="text-primary weight-fill" />
            <div>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-on-surface">
                Wishlist & Favorites
              </DialogTitle>
              <DialogDescription className="text-[11px] text-on-surface-variant/70">
                Manage your bookmarked components and production items.
              </DialogDescription>
            </div>
          </div>
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shrink-0">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
          </span>
        </DialogHeader>

        {/* Listado de Productos Favoritos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-container-lowest minimal-scrollbar">
          {favoriteItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant/40">
                <HeartIcon size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-on-surface">Your wishlist is empty</p>
                <p className="text-[11px] text-on-surface-variant/80">
                  Bookmark industrial specifications to monitor them here.
                </p>
              </div>
              <Button
                onClick={() => setFavoriteModalOpen(false)}
                variant="outline"
                size="sm"
                className="mt-2 text-xs border-outline text-primary rounded-[4px]"
              >
                Continue Browsing
              </Button>
            </div>
          ) : (
            favoriteItems.map((item) => (
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

                {/* Detalles del Producto */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className="text-xs font-bold text-on-surface truncate hover:text-primary transition-colors cursor-pointer"
                        title={item.title}
                      >
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeFromFavorites(item.id)}
                        className="text-on-surface-variant/60 hover:text-error transition-colors p-0.5"
                        title="Remove from favorites"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant/80">
                      <span>SKU: {item.sku}</span>
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: item.dotColor || 'currentColor' }} 
                        />
                        <span className={item.statusColor || 'text-on-surface-variant'}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de Cantidad e Indicadores de Precio */}
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

        {/* Footer del Dialog */}
        {favoriteItems.length > 0 && (
          <div className="p-4 border-t border-outline-variant bg-surface-container-low space-y-4 shadow-inner">
            <div className="flex justify-between items-center border-b border-outline-variant/60 pb-2 text-xs text-on-surface-variant">
              <span className="font-medium">Total Batch Value ({totalItems} items):</span>
              <span className="font-mono text-sm font-bold text-primary">${totalValue.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={clearFavorites}
                className="flex-1 border-outline text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error/40 text-xs font-semibold uppercase tracking-wider h-10 rounded-[4px]"
              >
                Clear All
              </Button>
              
              <Button
                onClick={() => setFavoriteModalOpen(false)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold uppercase tracking-wider h-10 rounded-[4px]"
              >
                Close View
              </Button>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}