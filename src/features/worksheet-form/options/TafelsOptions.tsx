import { TAFELS_NUMBERS, type TafelsConfig } from '@/domain/config'
import { nl } from '@/i18n/nl'
import { BlockCountField } from '../fields/BlockCountField'
import { NumberSetField } from '../fields/NumberSetField'
import { PerBlockField } from '../fields/PerBlockField'
import { fieldError } from '../issues'
import type { OptionsProps } from './types'

export function TafelsOptions({ config, onChange, issues }: OptionsProps<TafelsConfig>) {
  return (
    <>
      <NumberSetField
        legend={nl.form.tables}
        allowed={TAFELS_NUMBERS}
        values={config.tables}
        optionLabel={nl.tafelLabel}
        onChange={(tables) => onChange({ ...config, tables })}
        error={fieldError(issues, 'tables', 'tafels')}
      />
      <PerBlockField
        value={config.layout.perBlock}
        onChange={(perBlock) => onChange({ ...config, layout: { ...config.layout, perBlock } })}
      />
      {(['result', 'lhs', 'rhs'] as const).map((slot) => (
        <BlockCountField
          key={slot}
          label={nl.blockCounts.tafels[slot]}
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
