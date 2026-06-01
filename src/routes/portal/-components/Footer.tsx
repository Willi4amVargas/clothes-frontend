import { Link } from '@tanstack/react-router'
import {
  InstagramLogoIcon,
  PinterestLogoIcon,
  FacebookLogoIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  ClockIcon,
} from '@phosphor-icons/react'

export function Footer() {
  return (
    <footer className="bg-neutral-50 text-neutral-600 py-16 border-t border-neutral-200 font-sans">
      <div className="max-w-[1280px] mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">

          {/* Column 1: Brand Identity */}
          <div className="space-y-4">
            <Link
              to="/"
              className="text-xl font-serif tracking-widest text-neutral-900 flex items-center gap-2 uppercase"
            >
              <span>MUSE<span className="font-light italic text-neutral-500">Atelier</span></span>
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs font-normal">
              Prendas diseñadas con amor y dedicación para la mujer contemporánea.
              Elevando tus esenciales de cada día con la mejor calidad y cortes atemporales desde 2020.
            </p>
          </div>

          {/* Column 2: Customer Care / Policies */}
          <FooterColumn title="Ayuda & Soporte">
            {[
              { text: 'Políticas de Envío', href: '#' },
              { text: 'Cambios y Devoluciones', href: '#' },
              { text: 'Guía de Tallas', href: '#' },
              { text: 'Preguntas Frecuentes', href: '#' },
              { text: 'Términos y Condiciones', href: '#' },
            ].map((item) => (
              <FooterLink key={item.text} href={item.href}>
                {item.text}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Column 3: Quick Links / Account */}
          <FooterColumn title="Tu Cuenta">
            {[
              { text: 'Iniciar Sesión / Registrarse', href: '#' },
              { text: 'Historial de Pedidos', href: '#' },
              { text: 'Rastrear mi Paquete', href: '#' },
              { text: 'Mi Lista de Favoritos', href: '#' },
              { text: 'Club de Fidelidad ✨', href: '#' },
            ].map((item) => (
              <FooterLink key={item.text} href={item.href}>
                {item.text}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Column 4: Contact Info + Fashion Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-widest text-neutral-900">
              Contáctanos
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex items-center gap-2.5">
                <EnvelopeSimpleIcon size={16} className="text-neutral-400" />
                <a
                  href="mailto:hola@museatelier.com"
                  className="hover:text-black transition-colors"
                >
                  hola@museatelier.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneIcon size={16} className="text-neutral-400" />
                <span>+1 (800) 555-MUSE</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <ClockIcon size={16} className="text-neutral-400 mt-0.5" />
                <span className="text-neutral-500 leading-normal">
                  Lun - Vie: 9 AM - 7 PM
                  <br />
                  Sáb: 10 AM - 4 PM
                </span>
              </div>
            </div>

            {/* Social Icons - Cambiados por redes de moda */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="p-2 rounded-full bg-neutral-200/60 text-neutral-700 hover:text-white hover:bg-neutral-900 transition-all duration-200"
                title="Instagram"
              >
                <InstagramLogoIcon size={16} weight="light" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-neutral-200/60 text-neutral-700 hover:text-white hover:bg-neutral-900 transition-all duration-200"
                title="Pinterest"
              >
                <PinterestLogoIcon size={16} weight="light" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-neutral-200/60 text-neutral-700 hover:text-white hover:bg-neutral-900 transition-all duration-200"
                title="Facebook"
              >
                <FacebookLogoIcon size={16} weight="light" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center text-center gap-4 text-[11px] text-neutral-400">
          <p className="tracking-wide">
            © 2026 MUSE Atelier. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="hover:text-neutral-900 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-medium uppercase tracking-widest text-neutral-900">
        {title}
      </h4>
      <nav className="flex flex-col gap-2.5">{children}</nav>
    </div>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={href}
      className="text-xs text-neutral-500 hover:text-black transition-colors duration-150 font-normal"
    >
      {children}
    </Link>
  )
}