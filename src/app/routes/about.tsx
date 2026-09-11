import { nl } from '@/i18n/nl'

export function AboutPage() {
  return (
    <article className="grid max-w-3xl gap-6 py-8">
      <h1 className="font-display text-3xl font-bold">{nl.about.title}</h1>
      <section className="grid gap-2">
        <h2 className="font-display text-xl font-semibold">{nl.about.goalTitle}</h2>
        <p className="text-ink">{nl.about.goal}</p>
      </section>
      <section className="grid gap-4">
        <h2 className="font-display text-xl font-semibold">{nl.about.faqTitle}</h2>
        {nl.about.faq.map((item) => (
          <div key={item.question} className="grid gap-1">
            <h3 className="font-semibold text-brand-ink">{item.question}</h3>
            <p className="text-ink">{item.answer}</p>
          </div>
        ))}
      </section>
    </article>
  )
}
