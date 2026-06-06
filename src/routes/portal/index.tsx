import { createFileRoute } from '@tanstack/react-router'
import { CartProvider, useCart } from './-components/CartContext'
import { Header } from './-components/Header'
import { Hero } from './-components/Hero'
import { Catalog } from './-components/Catalog'
import { ValueProps } from './-components/ValueProps'
import { Footer } from './-components/Footer'
import { CartDrawer } from './-components/CartDrawer'
import { CheckoutView } from './-components/CheckoutView'
import { OrderSuccess } from './-components/OrderSuccess'
import { FavoriteProvider } from './-components/FavoriteContext'
import { FavoritesDialog } from './-components/FavoriteDialog'

export const Route = createFileRoute('/portal/')({
  component: () => (
    <CartProvider>
      <FavoriteProvider>
        <RouteComponent />
      </FavoriteProvider>
    </CartProvider>
  ),
  head: () => ({
    meta: [
      {
        title: `${import.meta.env.VITE_COMPANY_NAME} | ${import.meta.env.VITE_COMPANY_SLOGAN}`
      }
    ]
  })
})

function RouteComponent() {
  const { currentView } = useCart()

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col relative overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        {currentView === 'shop' && (
          <>
            <Hero />
            <Catalog />
            <ValueProps />
          </>
        )}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'success' && <OrderSuccess />}
      </main>
      <Footer />
      <CartDrawer />
      <FavoritesDialog />
    </div>
  )
}
