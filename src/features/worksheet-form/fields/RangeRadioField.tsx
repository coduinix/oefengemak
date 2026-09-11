import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export interface RangeOption<T extends string> {
  value: T
  label: string
}

interface RangeRadioFieldProps<T extends string> {
  legend: string
  value: T
  options: readonly RangeOption<T>[]
  onChange: (value: T) => void
}

export function RangeRadioField<T extends string>({
  legend,
  value,
  options,
  onChange,
}: RangeRadioFieldProps<T>) {
  const id = useId()
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-semibold text-brand-ink">{legend}</legend>
      <RadioGroup value={value} onValueChange={(next) => onChange(next as T)}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem id={`${id}-${option.value}`} value={option.value} />
            <Label htmlFor={`${id}-${option.value}`} className="font-normal text-ink">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  )
}
