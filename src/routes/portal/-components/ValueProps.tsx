import { 
  ShieldCheckIcon, 
  TruckIcon, 
  HeadsetIcon, 
  CreditCardIcon 
} from '@phosphor-icons/react'

export function ValueProps() {
  const props = [
    {
      icon: TruckIcon,
      title: 'Envíos Rápidos',
      description: 'Gratis en pedidos superiores a $99',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Devoluciones Simples',
      description: 'Hasta 30 días para cambios sin costo',
    },
    {
      icon: CreditCardIcon,
      title: 'Pago 100% Seguro',
      description: 'Tarjetas, PayPal y cuotas sin interés',
    },
    {
      icon: HeadsetIcon,
      title: 'Asesoría de Imagen',
      description: 'Soporte personalizado por WhatsApp',
    },
  ]

  return (
    <section className="bg-neutral-50 border-y border-neutral-200 py-12 font-sans">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {props.map((prop, index) => (
            <div key={index} className="flex items-center gap-4 group">
              {/* Contenedor del ícono: transición suave a tonos neutros/elegantes */}
              <div className="w-12 h-12 rounded-full bg-neutral-900/5 flex items-center justify-center text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-all duration-300 shrink-0">
                <prop.icon size={22} weight="light" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-medium text-sm tracking-wide text-neutral-900">
                  {prop.title}
                </h4>
                <p className="text-xs text-neutral-500 font-normal leading-normal">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}