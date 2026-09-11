export type Term =
  | { readonly kind: 'int'; readonly value: number }
  | { readonly kind: 'frac'; readonly n: number; readonly d: number }

export const int = (value: number): Term => ({ kind: 'int', value })
export const frac = (n: number, d: number): Term => ({ kind: 'frac', n, d })

export function isInt(term: Term): term is Extract<Term, { kind: 'int' }> {
  return term.kind === 'int'
}

export function isFrac(term: Term): term is Extract<Term, { kind: 'frac' }> {
  return term.kind === 'frac'
}

export function termValue(term: Term): number {
  return term.kind === 'int' ? term.value : term.n / term.d
}
