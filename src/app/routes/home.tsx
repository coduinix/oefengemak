import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Divide,
  Minus,
  Paperclip,
  PieChart,
  Plus,
  Printer,
  Split,
  UserX,
  X,
} from 'lucide-react'
import { EXERCISE_TYPES, type ExerciseType } from '@/domain/core'
import { defaultSplitsen } from '@/domain/config'
import { generateWorksheet } from '@/domain/worksheet'
import { Card, CardContent } from '@/components/ui/card'
import { SheetView } from '@/features/worksheet-preview/SheetView'
import { nl, typeStrings } from '@/i18n/nl'

const EXAMPLE_WORKSHEET = generateWorksheet({
  title: nl.home.exampleTitle,
  seed: 12345,
  sections: [{ config: { ...defaultSplitsen, count: 48, perBlock: 4 } }],
})

function ExampleSheet() {
  return (
    <div className="relative -rotate-2 justify-self-center">
      <Paperclip
        className="absolute -left-3 -top-4 size-8 -rotate-45 text-ink-muted"
        aria-hidden="true"
      />
      <div className="example-sheet w-56 sm:w-64">
        <SheetView worksheet={EXAMPLE_WORKSHEET} mode="student" />
      </div>
    </div>
  )
}

function PostIt() {
  return (
    <div className="rotate-3 justify-self-center rounded-md bg-postit-bg p-4 text-center text-sm font-semibold text-postit-ink shadow-lift">
      {nl.home.postit}
    </div>
  )
}

interface TypeVisual {
  icon: ComponentType<{ className?: string }>
  card: string
  accent: string
}

const VISUALS: Readonly<Record<ExerciseType, TypeVisual>> = {
  splitsen: { icon: Split, card: 'bg-tint-splitsen', accent: 'text-accent-splitsen' },
  plus: { icon: Plus, card: 'bg-tint-plus', accent: 'text-accent-plus' },
  min: { icon: Minus, card: 'bg-tint-min', accent: 'text-accent-min' },
  tafels: { icon: X, card: 'bg-tint-tafels', accent: 'text-accent-tafels' },
  delen: { icon: Divide, card: 'bg-tint-delen', accent: 'text-accent-delen' },
  breuken: { icon: PieChart, card: 'bg-tint-breuken', accent: 'text-accent-breuken' },
}

const FEATURE_ICONS = [BadgeCheck, UserX, Printer]

function Hero() {
  return (
    <section className="notebook-lines grid gap-8 rounded-card py-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
      <div className="grid gap-6">
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          {nl.home.heroTitle}
        </h1>
        <p className="max-w-xl text-lg text-ink-muted">{nl.home.heroBody}</p>
        <ul className="grid gap-3">
          {nl.home.features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index] ?? BadgeCheck
            return (
              <li key={feature} className="flex items-center gap-3 text-ink">
                <Icon className="size-5 text-brand" />
                {feature}
              </li>
            )
          })}
        </ul>
      </div>
      <div className="hidden gap-8 justify-items-center py-4 lg:grid">
        <ExampleSheet />
        <PostIt />
      </div>
    </section>
  )
}

function TypeCard({ type }: { type: ExerciseType }) {
  const visual = VISUALS[type]
  const Icon = visual.icon
  return (
    <Link
      to={`/sommen/${type}`}
      className={`${visual.card} group grid gap-3 rounded-card border border-line p-5 transition-shadow hover:shadow-lift`}
    >
      <Icon className={`size-8 ${visual.accent}`} />
      <span className="font-display text-lg font-semibold text-brand-ink">
        {typeStrings[type].name}
      </span>
      <span className="text-sm text-ink-muted">{typeStrings[type].blurb}</span>
      <ArrowRight className={`size-5 ${visual.accent}`} />
    </Link>
  )
}

function Steps() {
  return (
    <section className="grid gap-6 py-10">
      <h2 className="text-center font-display text-2xl font-semibold">{nl.home.howTitle}</h2>
      <ol className="grid gap-4 sm:grid-cols-3">
        {nl.home.steps.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tint-breuken font-display text-lg font-semibold text-brand">
              {index + 1}
            </span>
            <span className="grid gap-1">
              <span className="font-semibold text-brand-ink">{step.title}</span>
              <span className="text-sm text-ink-muted">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function HomePage() {
  return (
    <div className="grid gap-8">
      <Hero />
      <Card>
        <CardContent className="grid gap-6 p-6">
          <div className="grid gap-1 text-center">
            <h2 className="font-display text-2xl font-semibold">{nl.home.chooseTitle}</h2>
            <p className="text-sm text-ink-muted">{nl.home.chooseBody}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXERCISE_TYPES.map((type) => (
              <TypeCard key={type} type={type} />
            ))}
          </div>
          <Steps />
        </CardContent>
      </Card>
    </div>
  )
}
