import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Link, useRouter } from '@tanstack/react-router'
import { useAuth } from '#/hook/useAuth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'

const centerLinks = [
  { label: 'Inventory', url: '/inventory' },
  { label: 'Clients', url: '/clients' },
  { label: 'Sales POS', url: '/sales' },
]

export function MainHeader() {
  const router = useRouter()
  const { user } = useAuth()
  const [openCommandPageSearch, setCommandOpenPageSearch] = useState(false)

  const allRoutes = Object.values(router.routesById).filter((route) => {
    if (route.id === '__root__') return false

    if (!(route.path || route.fullPath)) return false

    const ultimoSegmentoId = route.id.split('/').pop() || ''
    const isLayout =
      route.path?.startsWith('_') || ultimoSegmentoId.startsWith('_')

    return !isLayout
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpenPageSearch((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNavigate = (path: string) => {
    router.navigate({ to: path })
    setCommandOpenPageSearch(false)
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-5">
      <Link to="/dashboard">
        <p className="min-w-fit text-sm font-semibold text-slate-900">
          Global Operations
        </p>
      </Link>

      <div className="relative max-w-md flex-1">
        <MagnifyingGlassIcon
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
        />
        <Input
          placeholder="Search pages... (Press ⌘K)"
          className="h-9 rounded-md border-slate-200 bg-slate-50 pl-8 pr-12 text-xs cursor-pointer"
          onClick={() => setCommandOpenPageSearch(true)}
          readOnly
        />
        <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>

        <CommandDialog
          open={openCommandPageSearch}
          onOpenChange={setCommandOpenPageSearch}
        >
          <Command>
            <CommandInput placeholder="Type a route or page to navigate..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {allRoutes.map((route) => {
                const targetPath = route.fullPath || route.path || '/'

                return (
                  <CommandItem
                    key={route.id}
                    value={route.path === '/' ? 'Home' : route.id}
                    onSelect={() => handleNavigate(targetPath)}
                    className="cursor-pointer flex flex-col items-start gap-0.5 py-2 px-4"
                  >
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {route.path === '/'
                        ? 'Home'
                        : route.path?.replace('/', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {targetPath}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandList>
          </Command>
        </CommandDialog>
      </div>

      <nav className="hidden items-center gap-4 text-xs text-slate-600 md:flex">
        {centerLinks.map((link) => (
          <Button
            asChild
            key={link.label}
            type="button"
            variant={'link'}
            size={'xs'}
          >
            <Link to={link.url}>{link.label}</Link>
          </Button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <Link
          to="/profile"
          className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 hover:bg-slate-50 transition-colors"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
            {user?.description[0] || 'U'}
          </div>
        </Link>
      </div>
    </header>
  )
}
