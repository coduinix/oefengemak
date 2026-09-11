import { toMixed } from '@/domain/core/fraction'

interface FractionViewProps {
  n: number
  d: number
}

function Stacked({ n, d }: FractionViewProps) {
  return (
    <span className="inline-flex flex-col items-center leading-tight">
      <span className="border-b border-current px-1">{n}</span>
      <span className="px-1">{d}</span>
    </span>
  )
}

export function FractionView({ n, d }: FractionViewProps) {
  if (n === 0) return <span>0</span>
  if (n === d) return <span>1</span>
  if (n > d) {
    const mixed = toMixed({ n, d })
    if (mixed.n === 0) return <span>{mixed.whole}</span>
    return (
      <span className="inline-flex items-center gap-1">
        <span>{mixed.whole}</span>
        <Stacked n={mixed.n} d={mixed.d} />
      </span>
    )
  }
  return <Stacked n={n} d={d} />
}
