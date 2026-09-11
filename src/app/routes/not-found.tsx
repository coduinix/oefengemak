import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { nl } from '@/i18n/nl'

export function NotFoundPage() {
  return (
    <div className="grid gap-4 py-16">
      <h1 className="font-display text-3xl font-bold">{nl.notFound.title}</h1>
      <p className="text-ink-muted">{nl.notFound.body}</p>
      <div>
        <Button asChild>
          <Link to="/">{nl.notFound.action}</Link>
        </Button>
      </div>
    </div>
  )
}
