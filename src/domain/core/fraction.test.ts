import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import * as F from './fraction'

const arbFraction = fc.record({
  n: fc.integer({ min: -50, max: 50 }),
  d: fc.integer({ min: 1, max: 50 }),
})

describe('gcd / lcm', () => {
  it('handles zero and negative inputs', () => {
    expect(F.gcd(0, 5)).toBe(5)
    expect(F.gcd(5, 0)).toBe(5)
    expect(F.gcd(0, 0)).toBe(0)
    expect(F.gcd(-12, 18)).toBe(6)
    expect(F.lcm(0, 7)).toBe(0)
    expect(F.lcm(-4, 6)).toBe(12)
  })

  it('divides both operands', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 500 }), fc.integer({ min: 1, max: 500 }), (a, b) => {
        const g = F.gcd(a, b)
        expect(a % g).toBe(0)
        expect(b % g).toBe(0)
      }),
    )
  })
})

describe('reduce', () => {
  it('normalises the sign onto the numerator', () => {
    expect(F.reduce({ n: 2, d: -4 })).toEqual({ n: -1, d: 2 })
    expect(F.reduce({ n: -2, d: -4 })).toEqual({ n: 1, d: 2 })
  })

  it('maps zero to 0/1', () => {
    expect(F.reduce({ n: 0, d: 7 })).toEqual({ n: 0, d: 1 })
  })

  it('rejects a zero denominator', () => {
    expect(() => F.reduce({ n: 1, d: 0 })).toThrow(RangeError)
  })

  it('always yields a coprime pair with a positive denominator', () => {
    fc.assert(
      fc.property(arbFraction, (f) => {
        const r = F.reduce(f)
        expect(r.d).toBeGreaterThan(0)
        expect(F.gcd(r.n, r.d)).toBe(r.n === 0 ? r.d : 1)
        expect(F.equals(r, f)).toBe(true)
      }),
    )
  })
})

describe('arithmetic', () => {
  it('matches decimal arithmetic', () => {
    fc.assert(
      fc.property(arbFraction, arbFraction, (a, b) => {
        expect(F.add(a, b).n / F.add(a, b).d).toBeCloseTo(a.n / a.d + b.n / b.d, 9)
        expect(F.subtract(a, b).n / F.subtract(a, b).d).toBeCloseTo(a.n / a.d - b.n / b.d, 9)
        expect(F.multiply(a, b).n / F.multiply(a, b).d).toBeCloseTo((a.n / a.d) * (b.n / b.d), 9)
      }),
    )
  })

  it('refuses to divide by zero', () => {
    expect(() => F.divide({ n: 1, d: 2 }, { n: 0, d: 3 })).toThrow(RangeError)
  })

  it('converts to a multiple denominator', () => {
    expect(F.convert({ n: 1, d: 3 }, 12)).toEqual({ n: 4, d: 12 })
    expect(() => F.convert({ n: 1, d: 5 }, 12)).toThrow(RangeError)
  })
})

describe('toMixed', () => {
  it.each([
    [
      { n: 3, d: 3 },
      { whole: 1, n: 0, d: 1 },
    ],
    [
      { n: 0, d: 5 },
      { whole: 0, n: 0, d: 1 },
    ],
    [
      { n: 7, d: 3 },
      { whole: 2, n: 1, d: 3 },
    ],
    [
      { n: 6, d: 3 },
      { whole: 2, n: 0, d: 1 },
    ],
    [
      { n: 2, d: 5 },
      { whole: 0, n: 2, d: 5 },
    ],
    [
      { n: -7, d: 3 },
      { whole: -2, n: 1, d: 3 },
    ],
  ])('%o -> %o', (input, expected) => {
    expect(F.toMixed(input)).toEqual(expected)
  })
})
