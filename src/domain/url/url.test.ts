import { describe, expect, it } from 'vitest'
import fc from 'fast-check'
import { EXERCISE_TYPES, type ExerciseType } from '@/domain/core'
import { MAX_URL_LENGTH } from '@/domain/config'
import { generateWorksheet } from '@/domain/worksheet'
import { arbConfig, arbSeed } from '@/domain/__tests__/arbitraries'
import { formatNumberList, parseNumberList } from './params'
import { buildWorksheetUrl, decodeWorksheet, encodeWorksheet } from './worksheet-url'

const searchOf = (url: string) => new URLSearchParams(url.slice(url.indexOf('?') + 1))

describe('number lists', () => {
  it('round-trip and collapse runs of three or more', () => {
    expect(formatNumberList([1, 2, 3, 4, 5, 7])).toBe('1-5,7')
    expect(formatNumberList([1, 2, 4])).toBe('1,2,4')
    expect(parseNumberList('1-5,7')).toEqual([1, 2, 3, 4, 5, 7])
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer({ min: 0, max: 100 })), (values) => {
        expect(parseNumberList(formatNumberList(values))).toEqual([...values].sort((a, b) => a - b))
      }),
    )
  })

  it('ignores malformed entries instead of throwing', () => {
    expect(parseNumberList('')).toEqual([])
    expect(parseNumberList('a,-3,2,,5-1')).toEqual([2])
  })
})

describe('worksheet URL', () => {
  it('round-trips every configuration', () => {
    fc.assert(
      fc.property(arbConfig, arbSeed, (config, seed) => {
        const decoded = decodeWorksheet(config.type, encodeWorksheet(config, seed, 'Titel'))
        expect(decoded.config).toEqual(config)
        expect(decoded.title).toBe('Titel')
        expect(decoded.spec?.seed).toBe(seed)
      }),
      { numRuns: 100 },
    )
  })

  it('round-trips the generated worksheet itself', () => {
    fc.assert(
      fc.property(arbConfig, arbSeed, (config, seed) => {
        const spec = { title: 'T', seed, sections: [{ config }] }
        const decoded = decodeWorksheet(config.type, encodeWorksheet(config, seed, 'T')).spec
        expect(decoded).not.toBeNull()
        expect(generateWorksheet(decoded as typeof spec)).toEqual(generateWorksheet(spec))
      }),
      { numRuns: 40 },
    )
  })

  it('stays well under the URL budget', () => {
    fc.assert(
      fc.property(arbConfig, arbSeed, (config, seed) => {
        expect(buildWorksheetUrl(config, seed, 'Rekenen week 12').length).toBeLessThan(
          MAX_URL_LENGTH,
        )
      }),
      { numRuns: 40 },
    )
  })

  it('produces the documented plus link', () => {
    const url = buildWorksheetUrl(
      {
        type: 'plus',
        sumRange: { min: 0, max: 20 },
        carry: 'none',
        minOperand: 0,
        layout: { perBlock: 5, counts: { result: 4, lhs: 4, rhs: 0 } },
      },
      Number.parseInt('8kq2m1', 36),
      'Rekenen week 12',
    )
    expect(url).toBe(
      '/sommen/plus?v=1&s=8kq2m1&t=Rekenen+week+12&min=0&max=20&carry=none&mo=0&pb=5&res=4&lhs=4&rhs=0',
    )
  })

  it('shows the empty form when no seed is present', () => {
    expect(decodeWorksheet('plus', new URLSearchParams('max=20')).spec).toBeNull()
  })

  it('drops the title rather than exceeding the URL budget', () => {
    const config = {
      type: 'min' as const,
      max: 10,
      layout: { perBlock: 5, counts: { result: 1, lhs: 0, rhs: 0 } },
    }
    const url = buildWorksheetUrl(config, 1, 'x'.repeat(200))
    expect(url.length).toBeLessThan(MAX_URL_LENGTH)
  })
})

describe('decoding is total', () => {
  const garbage = [
    'pb=-1&res=NaN&tab=99,-3',
    'v=abc&s=!!!&pb=1e9',
    'den=7&add=-4&sub=999999',
    'max=&min=&carry=maybe',
    'tab=&n=&div=',
    'count=1e400&pb=0',
    `t=${'x'.repeat(10_000)}`,
    'pb=5&pb=6&res=1&res=2',
  ]

  it.each(EXERCISE_TYPES)('never throws for %s', (type: ExerciseType) => {
    for (const search of garbage) {
      expect(() => decodeWorksheet(type, new URLSearchParams(search))).not.toThrow()
    }
  })

  it('falls back to a valid, re-encodable configuration', () => {
    fc.assert(
      fc.property(fc.constantFrom(...EXERCISE_TYPES), fc.string(), (type, raw) => {
        const { config } = decodeWorksheet(type, new URLSearchParams(raw))
        expect(config.type).toBe(type)
        expect(decodeWorksheet(type, encodeWorksheet(config, 1, '')).config).toEqual(config)
      }),
      { numRuns: 200 },
    )
  })

  it('flags that it repaired a malformed parameter', () => {
    expect(decodeWorksheet('plus', new URLSearchParams('s=1&pb=-1')).repaired).toBe(true)
    expect(decodeWorksheet('plus', new URLSearchParams('s=1&pb=5')).repaired).toBe(false)
  })

  it('ignores unknown parameters', () => {
    const known = decodeWorksheet('min', new URLSearchParams('s=1&max=20'))
    const noisy = decodeWorksheet('min', new URLSearchParams('s=1&max=20&zomaar=1&x=y'))
    expect(noisy.config).toEqual(known.config)
    expect(noisy.repaired).toBe(false)
  })

  it('keeps the type from the route, not the query string', () => {
    expect(decodeWorksheet('min', searchOf('/x?type=plus&s=1')).config.type).toBe('min')
  })
})
