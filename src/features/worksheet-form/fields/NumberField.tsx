import { useId } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface NumberFieldProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  error?: string | undefined
}

export function NumberField({ label, value, min, max, onChange, error }: NumberFieldProps) {
  const id = useId()
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={String(value)}
        aria-invalid={error !== undefined}
        onChange={(event) => {
          const parsed = Number(event.target.value)
          if (!Number.isFinite(parsed)) return
          onChange(Math.min(max, Math.max(min, Math.trunc(parsed))))
        }}
      />
      {error === undefined ? null : <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
