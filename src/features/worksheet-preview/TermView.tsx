import type { Term } from '@/domain/core'
import { FractionView } from './FractionView'

export function TermView({ term }: { term: Term }) {
  if (term.kind === 'int') return <span>{term.value}</span>
  return <FractionView n={term.n} d={term.d} />
}
