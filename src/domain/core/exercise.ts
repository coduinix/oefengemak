import type { Term } from './term'
import * as F from './fraction'

export type Operator = '+' | '-' | '×' | ':'
export type Slot = 'lhs' | 'rhs' | 'result'

export const SLOTS: readonly Slot[] = ['lhs', 'rhs', 'result']

export interface Exercise {
  readonly lhs: Term
  readonly operator: Operator
  readonly rhs: Term
  readonly result: Term
}

const INT_OPS: Record<Operator, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  ':': (a, b) => a / b,
}

const FRAC_OPS: Record<Operator, (a: F.Fraction, b: F.Fraction) => F.Fraction> = {
  '+': F.add,
  '-': F.subtract,
  '×': F.multiply,
  ':': F.divide,
}

export function applyOperator(lhs: Term, operator: Operator, rhs: Term): Term {
  if (lhs.kind === 'int' && rhs.kind === 'int') {
    return { kind: 'int', value: INT_OPS[operator](lhs.value, rhs.value) }
  }
  const a = toFraction(lhs)
  const b = toFraction(rhs)
  const { n, d } = F.reduce(FRAC_OPS[operator](a, b))
  return { kind: 'frac', n, d }
}

function toFraction(term: Term): F.Fraction {
  return term.kind === 'int' ? { n: term.value, d: 1 } : { n: term.n, d: term.d }
}

export function exercise(lhs: Term, operator: Operator, rhs: Term, result: Term): Exercise {
  return { lhs, operator, rhs, result }
}

export function slotValue(e: Exercise, slot: Slot): Term {
  return e[slot]
}

export function sameTerms(a: Term, b: Term): boolean {
  if (a.kind === 'int' && b.kind === 'int') return a.value === b.value
  if (a.kind === 'frac' && b.kind === 'frac') return a.n === b.n && a.d === b.d
  return false
}

export function sameExercise(a: Exercise, b: Exercise): boolean {
  return a.operator === b.operator && sameTerms(a.lhs, b.lhs) && sameTerms(a.rhs, b.rhs)
}
