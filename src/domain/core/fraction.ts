export interface Fraction {
  readonly n: number
  readonly d: number
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return Math.abs((a / gcd(a, b)) * b)
}

export function reduce({ n, d }: Fraction): Fraction {
  if (d === 0) throw new RangeError('Fraction denominator must not be zero')
  const sign = d < 0 ? -1 : 1
  const divisor = gcd(n, d) || 1
  return { n: (sign * n) / divisor, d: (sign * d) / divisor }
}

export function convert(f: Fraction, denominator: number): Fraction {
  if (denominator % f.d !== 0) {
    throw new RangeError(`Cannot convert /${f.d} to /${denominator}`)
  }
  const factor = denominator / f.d
  return { n: f.n * factor, d: denominator }
}

export function add(a: Fraction, b: Fraction): Fraction {
  return { n: a.n * b.d + b.n * a.d, d: a.d * b.d }
}

export function subtract(a: Fraction, b: Fraction): Fraction {
  return { n: a.n * b.d - b.n * a.d, d: a.d * b.d }
}

export function multiply(a: Fraction, b: Fraction): Fraction {
  return { n: a.n * b.n, d: a.d * b.d }
}

export function divide(a: Fraction, b: Fraction): Fraction {
  if (b.n === 0) throw new RangeError('Cannot divide by the zero fraction')
  return { n: a.n * b.d, d: a.d * b.n }
}

export function equals(a: Fraction, b: Fraction): boolean {
  return a.n * b.d === b.n * a.d
}

export interface MixedNumber {
  readonly whole: number
  readonly n: number
  readonly d: number
}

/** Splits an improper fraction into whole + remainder. Both parts carry the overall sign. */
export function toMixed(f: Fraction): MixedNumber {
  const { n, d } = reduce(f)
  const sign = n < 0 ? -1 : 1
  const abs = Math.abs(n)
  const whole = Math.floor(abs / d)
  return { whole: sign * whole, n: abs % d, d }
}
