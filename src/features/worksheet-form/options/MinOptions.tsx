import type { MinConfig } from '@/domain/config'
import { nl } from '@/i18n/nl'
import { BlockCountField } from '../fields/BlockCountField'
import { PerBlockField } from '../fields/PerBlockField'
import { RangeRadioField, type RangeOption } from '../fields/RangeRadioField'
import type { OptionsProps } from './types'

type MinRangeId = keyof typeof nl.minRanges

const OPTIONS: readonly RangeOption<MinRangeId>[] = (Object.keys(nl.minRanges) as MinRangeId[]).map(
  (value) => ({ value, label: nl.minRanges[value] }),
)

export function MinOptions({ config, onChange }: OptionsProps<MinConfig>) {
  return (
    <>
      <RangeRadioField
        legend={nl.form.range}
        value={String(config.max) as MinRangeId}
        options={OPTIONS}
        onChange={(id) => onChange({ ...config, max: Number(id) })}
      />
      <PerBlockField
        value={config.layout.perBlock}
        onChange={(perBlock) => onChange({ ...config, layout: { ...config.layout, perBlock } })}
      />
      {(['result', 'lhs', 'rhs'] as const).map((slot) => (
        <BlockCountField
          key={slot}
          label={nl.blockCounts.min[slot]}
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
