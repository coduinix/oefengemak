import { nl } from '@/i18n/nl'

export function DonerenPage() {
  return (
    <article className="grid max-w-2xl gap-4 py-8">
      <h1 className="font-display text-3xl font-bold">{nl.doneren.title}</h1>
      <p className="text-ink">{nl.doneren.body}</p>
      <p className="rounded-card bg-tint-splitsen p-4 text-ink">{nl.doneren.comingSoon}</p>
      <p className="text-ink">{nl.doneren.contact}</p>
      <a
        href={`mailto:${nl.doneren.email}`}
        className="font-semibold text-brand hover:underline justify-self-start"
      >
        {nl.doneren.email}
      </a>
    </article>
  )
}
