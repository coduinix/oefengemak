import { useId } from 'react'
import { BREUKEN_DENOMINATORS, type BreukenConfig } from '@/domain/config'
import { FRACTION_OPS } from '@/domain/generators'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { nl } from '@/i18n/nl'
import { BlockCountField } from '../fields/BlockCountField'
import { PerBlockField } from '../fields/PerBlockField'
import type { OptionsProps } from './types'

type Denominator = BreukenConfig['maxDenominator']

export function BreukenOptions({ config, onChange }: OptionsProps<BreukenConfig>) {
  const id = useId()
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor={id}>{nl.form.denominator}</Label>
        <Select
          value={String(config.maxDenominator)}
          onValueChange={(value) =>
            onChange({ ...config, maxDenominator: Number(value) as Denominator })
          }
        >
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BREUKEN_DENOMINATORS.map((denominator) => (
              <SelectItem key={denominator} value={String(denominator)}>
                {nl.breukenDenominators[String(denominator) as `${Denominator}`]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <PerBlockField
        value={config.perBlock}
        onChange={(perBlock) => onChange({ ...config, perBlock })}
      />
      {FRACTION_OPS.map((op) => (
        <BlockCountField
          key={op}
          label={nl.blockCounts.breuken[op]}
          value={config.counts[op]}
          onChange={(value) => onChange({ ...config, counts: { ...config.counts, [op]: value } })}
        />
      ))}
    </>
  )
}
