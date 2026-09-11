import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown, Heart } from 'lucide-react'
import { cn } from '@/lib/cn'

const sommen = [
  { to: '/sommen/splitsen', label: 'Splitsen' },
  { to: '/sommen/plus', label: 'Plus' },
  { to: '/sommen/min', label: 'Min' },
  { to: '/sommen/tafels', label: 'Tafels' },
  { to: '/sommen/delen', label: 'Delen' },
  { to: '/sommen/breuken', label: 'Breuken' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-2 py-1 text-sm font-semibold transition-colors hover:text-brand-ink',
    isActive ? 'text-brand-ink' : 'text-ink-muted',
  )

function Wordmark() {
  return (
    <NavLink to="/" className="inline-flex flex-col items-start gap-0.5 text-brand">
      <span className="font-display text-2xl font-bold leading-none tracking-tight">
        Oefengemak
      </span>
      <svg viewBox="0 0 140 8" className="h-2 w-32 text-brand" aria-hidden="true">
        <path
          d="M2 5.5C22 2.2 52 1.2 90 2.4c16 .5 33 1.6 48 3.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </NavLink>
  )
}

function SommenMenu() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-ink"
      >
        Sommen
        <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 grid w-44 gap-0.5 rounded-2xl border border-line bg-surface p-2 shadow-lift"
        >
          {sommen.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-canvas',
                  isActive ? 'bg-canvas text-brand-ink' : 'text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Wordmark />
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <SommenMenu />
          <NavLink to="/about" className={navLinkClass}>
            Over Oefengemak
          </NavLink>
          <NavLink
            to="/doneren"
            className="ml-1 inline-flex items-center gap-2 rounded-xl border border-accent-splitsen/40 bg-tint-splitsen px-3 py-1.5 text-sm font-semibold text-accent-splitsen transition-shadow hover:shadow-soft"
          >
            <Heart className="size-4" />
            Steun ons
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
