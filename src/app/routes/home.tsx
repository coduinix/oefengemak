import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Divide,
  Heart,
  Minus,
  PieChart,
  Plus,
  Printer,
  Split,
  UserX,
  X,
} from 'lucide-react'
import { EXERCISE_TYPES, type ExerciseType } from '@/domain/core'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { nl, typeStrings } from '@/i18n/nl'

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
    <section className="grid gap-6 py-10">
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

function SupportBand() {
  return (
    <section className="grid items-center gap-4 rounded-card bg-tint-splitsen p-6 sm:grid-cols-[1fr_auto]">
      <div className="grid gap-2">
        <h2 className="font-display text-xl font-semibold">{nl.home.supportTitle}</h2>
        <p className="text-sm text-ink">{nl.home.supportBody}</p>
      </div>
      <Button asChild size="lg">
        <Link to="/doneren">
          <Heart />
          {nl.home.supportAction}
        </Link>
      </Button>
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
          <SupportBand />
        </CardContent>
      </Card>
    </div>
  )
}
