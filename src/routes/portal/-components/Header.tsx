import {
  ShoppingCartSimpleIcon,
  UserIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@phosphor-icons/react'
import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'
import { useCart } from './CartContext'
import { useState } from 'react'
import { useFavorites } from './FavoriteContext'

export function Header() {
  const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME
  const { cartItems, setCartDrawerOpen, setCurrentView } = useCart()
  const { setFavoriteModalOpen } = useFavorites()
  const [searchQuery, setSearchQuery] = useState('')

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular busqueda
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className="w-full flex flex-col border-b border-outline-variant bg-surface-container-lowest font-sans">
      {/* Row 1: Top Utility Bar (Banner de promociones y utilidades) */}
      <div className="bg-neutral-900 py-2 text-[11px] font-medium tracking-wider text-white uppercase">
        <div className="max-w-[1280px] mx-auto px-10 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5 animate-pulse">
              ✨ ¡Envío gratis en compras mayores a $99!
            </span>
            <span className="hidden md:inline text-neutral-400">
              10% OFF en tu primera compra con el código: NEWMUSE
            </span>
          </div>
          <div className="flex gap-6 items-center">
            <Link to="#" className="hover:text-neutral-300 transition-colors border-l border-neutral-700 pl-4">
              Ayuda
            </Link>
            <Link to="#" className="hover:text-neutral-300 transition-colors">
              Rastrear Pedido
            </Link>
            <Link to="/dashboard" className="hover:text-neutral-300 transition-colors">
              Entrar al dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Main Header (Logo Centro/Izquierda, Buscador Estilizado, Acciones) */}
      <div className="py-5 border-b border-outline-variant">
        <div className="max-w-[1280px] mx-auto px-10 flex items-center justify-between gap-8">
          {/* Logo - Tipografía más elegante y estilizada */}
          <Link
            to="/"
            onClick={() => setCurrentView('shop')}
            className="flex items-center gap-2 text-2xl font-serif tracking-widest text-primary select-none cursor-pointer uppercase"
          >
            <span>{COMPANY_NAME.split(" ")[0]}</span>
            {COMPANY_NAME.split(" ").slice(1).join(" ") && (
              <span className="font-light italic text-secondary-text">
                {COMPANY_NAME.split(" ").slice(1).join(" ")}
              </span>
            )}
          </Link>

          {/* Search Bar - Enfocada en moda, bordes más suaves */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-[480px] h-10 flex items-center border border-neutral-300 rounded-full bg-transparent focus-within:border-black focus-within:ring-1 focus-within:ring-black/10 transition-all pl-4 overflow-hidden"
          >
            <MagnifyingGlassIcon size={16} className="text-neutral-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar vestidos, calzado, accesorios..."
              className="w-full h-full border-none outline-none text-sm font-normal text-on-surface bg-transparent placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="h-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium px-6 tracking-widest uppercase transition-colors shrink-0"
            >
              Buscar
            </button>
          </form>

          {/* Actions - Íconos limpios de retail */}
          <div className="flex items-center gap-2">
            {/* Wishlist (Clave en moda femenina) */}
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full relative"
              title="Mis Favoritos"
              onClick={() => setFavoriteModalOpen(true)}
            >
              <HeartIcon size={22} />
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartDrawerOpen(true)}
              className="text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full relative"
              title="Carrito de compras"
            >
              <ShoppingCartSimpleIcon size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Button>

            <span className="h-5 w-[1px] bg-neutral-300 mx-1"></span>

            {/* User Profile - Removido el ID de contratación */}
            <Button
              variant="ghost"
              className="text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium text-xs rounded-full py-1.5 px-3 flex items-center gap-2"
            >
              <UserIcon size={20} />
              <span className="hidden sm:inline">Mi Cuenta</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Row 3: Bottom Category Navigation */}
      <div className="py-3 bg-white">
        <div className="max-w-[1280px] mx-auto px-10 flex items-center justify-between">
          <nav className="flex items-center gap-8 mx-auto">
            {[
              { name: 'Novedades', highlight: true },
              { name: 'Vestidos', highlight: false },
              { name: 'Blusas & Tops', highlight: false },
              { name: 'Pantalones', highlight: false },
              { name: 'Calzado', highlight: false },
              { name: 'Accesorios', highlight: false },
              { name: 'Ofertas 🔥', highlight: true }
            ].map((item) => (
              <Link
                key={item.name}
                to="#"
                className={`text-xs font-medium tracking-widest uppercase transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-black hover:after:w-full after:transition-all after:duration-200 
              ${item.highlight ? 'text-rose-600 font-semibold' : 'text-neutral-600 hover:text-black'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

