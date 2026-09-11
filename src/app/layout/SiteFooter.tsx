import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Over Oefengemak',
    links: [{ to: '/about', label: 'Wat is Oefengemak?' }],
    text: 'Gratis oefenbladen voor het basisonderwijs, gemaakt met liefde voor het onderwijs.',
  },
  {
    title: 'Hoe het werkt',
    links: [
      { to: '/sommen/plus', label: 'Maak een oefenblad' },
      { to: '/sommen/tafels', label: 'Tafels oefenen' },
    ],
    text: 'Kies een som, stel in en print direct.',
  },
  {
    title: 'Privacy',
    links: [{ to: '/about', label: 'Privacy en gegevens' }],
    text: 'Geen account nodig, wij gaan zorgvuldig om met jouw gegevens.',
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface print:hidden">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title} className="grid gap-2">
              <h2 className="font-display text-sm font-semibold text-brand-ink">{column.title}</h2>
              <p className="text-sm text-ink-muted">{column.text}</p>
              {column.links.map((link) => (
                <Link
                  key={`${column.title}-${link.to}-${link.label}`}
                  to={link.to}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="grid gap-2">
            <h2 className="font-display text-sm font-semibold text-brand-ink">Contact</h2>
            <p className="text-sm text-ink-muted">Vragen of ideeën? Laat het ons weten!</p>
            <a
              href="mailto:info@oefengemak.nl"
              className="text-sm font-semibold text-brand hover:underline"
            >
              info@oefengemak.nl
            </a>
            <Link to="/doneren" className="text-sm font-semibold text-brand hover:underline">
              Steun ons
            </Link>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-ink-muted">
          © 2026 Oefengemak – Met liefde voor het onderwijs
        </p>
      </div>
    </footer>
  )
}
