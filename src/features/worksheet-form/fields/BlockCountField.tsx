import { MAX_BLOCKS } from '@/domain/config'
import { NumberField } from './NumberField'

interface BlockCountFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
}

export function BlockCountField({ label, value, onChange }: BlockCountFieldProps) {
  return <NumberField label={label} value={value} min={0} max={MAX_BLOCKS} onChange={onChange} />
}
