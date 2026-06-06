import { Button } from '#/components/ui/button'
import { useCart } from './CartContext'

export function Hero() {
  const { setCurrentView } = useCart()

  return (
    <section className="bg-surface-container-low py-16 border-b border-outline-variant font-sans">
      <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text & Actions */}
        <div className="space-y-6 max-w-xl">
          <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-widest bg-rose-50 text-rose-600 border border-rose-100 uppercase">
            Nueva Colección Primavera
          </span>

          <h1 className="text-4xl lg:text-[46px] font-serif tracking-tight text-on-surface leading-tight">
            Designs that inspire <br />
            <span className="text-neutral-900 font-light italic">your essence and elegance</span>
          </h1>

          <p className="text-sm text-on-surface-variant leading-relaxed font-normal">
            Discover garments crafted with premium fabrics, impeccable cuts, and
            details designed to boost your confidence. From elevated basics to
            statement pieces for your special occasions.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              onClick={() => setCurrentView('shop')}
              className="px-8 h-11 bg-neutral-900 text-white font-medium rounded-full text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Comprar Ahora
            </Button>
            <Button
              variant="outline"
              className="px-8 h-11 border-neutral-300 text-neutral-800 hover:text-black hover:bg-neutral-50 font-medium rounded-full text-xs uppercase tracking-widest transition-colors"
            >
              Ver Lookbook
            </Button>
          </div>
        </div>

        {/* Right Side: Visual Content */}
        <div className="relative group">
          {/* Contenedor de imagen estilizado para moda */}
          <div className="aspect-4/3 rounded-xl bg-neutral-100 border border-outline-variant overflow-hidden flex items-center justify-center shadow-lg relative">

            {/* Imagen de Fondo (Campaña de Moda) */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>

            {/* Overlay sutil para darle profundidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

            {/* Etiqueta flotante minimalista en lugar del cuadro CAD técnico */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-xl flex items-center justify-between transform group-hover:translate-y-[-4px] transition-transform duration-300">
              <div className="flex flex-col">
                <span className="text-xs font-serif font-bold text-neutral-900 tracking-wide uppercase">Lino Premium & Seda</span>
                <span className="text-[10px] text-neutral-500 tracking-wider">Edición Limitada</span>
              </div>
              <span className="text-xs font-semibold text-rose-600 tracking-wider uppercase border-b border-rose-600 pb-0.5 cursor-pointer">
                Explorar material
              </span>
            </div>
          </div>

          {/* Elementos de acento visual (Suaves sombras de color pastel en lugar de los industriales) */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-rose-100/40 rounded-full blur-2xl -z-10"></div>
          <div className="absolute -top-6 -right-6 w-48 h-48 bg-amber-100/30 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  )
}
