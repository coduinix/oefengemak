import { err, issue, ok, type Result } from '@/domain/core'
import { MAX_BLOCKS, MAX_EXERCISES, MAX_PER_BLOCK, type VariationLayout } from '@/domain/config'
import { DEFAULT_POOL, type LayoutSpec } from '@/domain/layout'
import type { ParamReader, ParamWriter } from '@/domain/url/params'

/** Shared by plus, min, tafels and delen: one "sommen per blok" plus three block counts. */
export function variationLayout(layout: VariationLayout): LayoutSpec {
  return { kind: 'variation', perBlock: layout.perBlock, counts: layout.counts }
}

export function variationTotal(layout: VariationLayout): number {
  const { result, lhs, rhs } = layout.counts
  return layout.perBlock * (result + lhs + rhs)
}

export function validateVariation<C extends { layout: VariationLayout }>(config: C): Result<C> {
  const total = variationTotal(config.layout)
  if (total === 0) return err([issue('NO_EXERCISES')])
  if (total > MAX_EXERCISES) return err([issue('TOO_MANY_EXERCISES')])
  return ok(config)
}

export function writeVariation(layout: VariationLayout, writer: ParamWriter): void {
  writer.set('pb', layout.perBlock)
  writer.set('res', layout.counts.result)
  writer.set('lhs', layout.counts.lhs)
  writer.set('rhs', layout.counts.rhs)
}

export function readVariation(reader: ParamReader, fallback: VariationLayout): VariationLayout {
  return {
    perBlock: reader.int('pb', fallback.perBlock, 1, MAX_PER_BLOCK),
    counts: {
      result: reader.int('res', fallback.counts.result, 0, MAX_BLOCKS),
      lhs: reader.int('lhs', fallback.counts.lhs, 0, MAX_BLOCKS),
      rhs: reader.int('rhs', fallback.counts.rhs, 0, MAX_BLOCKS),
    },
  }
}

export const VARIATION_POOL = DEFAULT_POOL
