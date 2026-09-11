import { MAX_BLOCKS, MAX_PER_BLOCK, SPLITSEN_NUMBERS, type SplitsenConfig } from '@/domain/config'
import { nl } from '@/i18n/nl'
import { NumberField } from '../fields/NumberField'
import { NumberSetField } from '../fields/NumberSetField'
import { PerBlockField } from '../fields/PerBlockField'
import { fieldError } from '../issues'
import type { OptionsProps } from './types'

export function SplitsenOptions({ config, onChange, issues }: OptionsProps<SplitsenConfig>) {
  return (
    <>
      <NumberSetField
        legend={nl.form.numbers}
        allowed={SPLITSEN_NUMBERS}
        values={config.numbers}
        onChange={(numbers) => onChange({ ...config, numbers })}
        error={fieldError(issues, 'numbers', 'splitsen')}
      />
      <NumberField
        label={nl.form.count}
        value={config.count}
        min={0}
        max={MAX_BLOCKS * MAX_PER_BLOCK}
        onChange={(count) => onChange({ ...config, count })}
        error={fieldError(issues, 'count', 'splitsen')}
      />
      <PerBlockField
        value={config.perBlock}
        onChange={(perBlock) => onChange({ ...config, perBlock })}
      />
    </>
  )
}
