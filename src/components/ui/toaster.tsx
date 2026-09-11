import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'rounded-2xl border border-line bg-surface text-ink shadow-lift font-sans print:hidden',
          title: 'font-semibold text-brand-ink',
          description: 'text-ink-muted',
          actionButton: 'bg-primary text-primary-foreground rounded-lg',
          cancelButton: 'bg-canvas text-ink rounded-lg',
          error: 'text-danger',
        },
      }}
    />
  )
}
