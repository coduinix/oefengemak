import { DELEN_DIVISORS, type DelenConfig } from '@/domain/config'
import { nl } from '@/i18n/nl'
import { BlockCountField } from '../fields/BlockCountField'
import { NumberSetField } from '../fields/NumberSetField'
import { PerBlockField } from '../fields/PerBlockField'
import { fieldError } from '../issues'
import type { OptionsProps } from './types'

export function DelenOptions({ config, onChange, issues }: OptionsProps<DelenConfig>) {
  return (
    <>
      <NumberSetField
        legend={nl.form.divisors}
        allowed={DELEN_DIVISORS}
        values={config.divisors}
        onChange={(divisors) => onChange({ ...config, divisors })}
        error={fieldError(issues, 'divisors', 'delen')}
      />
      <PerBlockField
        value={config.layout.perBlock}
        onChange={(perBlock) => onChange({ ...config, layout: { ...config.layout, perBlock } })}
      />
      {(['result', 'lhs', 'rhs'] as const).map((slot) => (
        <BlockCountField
          key={slot}
          label={nl.blockCounts.delen[slot]}
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
