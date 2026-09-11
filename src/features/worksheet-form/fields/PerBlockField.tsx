import { MAX_PER_BLOCK } from '@/domain/config'
import { nl } from '@/i18n/nl'
import { NumberField } from './NumberField'

interface PerBlockFieldProps {
  value: number
  onChange: (value: number) => void
}

export function PerBlockField({ value, onChange }: PerBlockFieldProps) {
  return (
    <NumberField
      label={nl.form.perBlock}
      value={value}
      min={1}
      max={MAX_PER_BLOCK}
      onChange={onChange}
    />
  )
}
