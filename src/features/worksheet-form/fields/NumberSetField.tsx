import { useId } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface NumberSetFieldProps {
  legend: string
  allowed: readonly number[]
  values: readonly number[]
  onChange: (values: readonly number[]) => void
  optionLabel?: (value: number) => string
  error?: string | undefined
}

export function NumberSetField({
  legend,
  allowed,
  values,
  onChange,
  optionLabel = String,
  error,
}: NumberSetFieldProps) {
  const id = useId()
  const selected = new Set(values)

  const toggle = (value: number, checked: boolean) => {
    const next = new Set(selected)
    if (checked) next.add(value)
    else next.delete(value)
    onChange(allowed.filter((option) => next.has(option)))
  }

  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-semibold text-brand-ink">{legend}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {allowed.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <Checkbox
              id={`${id}-${option}`}
              checked={selected.has(option)}
              onCheckedChange={(checked) => toggle(option, checked === true)}
            />
            <Label htmlFor={`${id}-${option}`} className="font-normal text-ink">
              {optionLabel(option)}
            </Label>
          </div>
        ))}
      </div>
      {error === undefined ? null : <p className="text-sm text-danger">{error}</p>}
    </fieldset>
  )
}
