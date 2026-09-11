import type { PlusConfig } from '@/domain/config'
import { nl } from '@/i18n/nl'
import { BlockCountField } from '../fields/BlockCountField'
import { PerBlockField } from '../fields/PerBlockField'
import { RangeRadioField, type RangeOption } from '../fields/RangeRadioField'
import type { OptionsProps } from './types'

type PlusRangeId = keyof typeof nl.plusRanges

const RANGES: Readonly<Record<PlusRangeId, { max: number; carry: PlusConfig['carry'] }>> = {
  '10': { max: 10, carry: 'any' },
  '20-none': { max: 20, carry: 'none' },
  '20': { max: 20, carry: 'any' },
  '50': { max: 50, carry: 'any' },
  '100': { max: 100, carry: 'any' },
  '1000': { max: 1000, carry: 'any' },
}

const OPTIONS: readonly RangeOption<PlusRangeId>[] = (Object.keys(RANGES) as PlusRangeId[]).map(
  (value) => ({ value, label: nl.plusRanges[value] }),
)

function currentRange(config: PlusConfig): PlusRangeId {
  const match = (Object.keys(RANGES) as PlusRangeId[]).find(
    (id) => RANGES[id].max === config.sumRange.max && RANGES[id].carry === config.carry,
  )
  return match ?? '10'
}

export function PlusOptions({ config, onChange }: OptionsProps<PlusConfig>) {
  const setRange = (id: PlusRangeId) => {
    const range = RANGES[id]
    onChange({ ...config, sumRange: { min: 0, max: range.max }, carry: range.carry })
  }

  return (
    <>
      <RangeRadioField
        legend={nl.form.range}
        value={currentRange(config)}
        options={OPTIONS}
        onChange={setRange}
      />
      <PerBlockField
        value={config.layout.perBlock}
        onChange={(perBlock) => onChange({ ...config, layout: { ...config.layout, perBlock } })}
      />
      {(['result', 'lhs', 'rhs'] as const).map((slot) => (
        <BlockCountField
          key={slot}
          label={nl.blockCounts.plus[slot]}
          value={config.layout.counts[slot]}
          onChange={(value) =>
            onChange({
              ...config,
              layout: { ...config.layout, counts: { ...config.layout.counts, [slot]: value } },
            })
          }
        />
      ))}
    </>
  )
}
