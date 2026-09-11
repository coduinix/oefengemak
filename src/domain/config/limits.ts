export const MAX_EXERCISES = 500
export const MAX_PER_BLOCK = 20
export const MAX_BLOCKS = 40
export const MAX_TITLE_LENGTH = 80
export const MAX_URL_LENGTH = 2000

export const SPLITSEN_NUMBERS = range(1, 20)
export const TAFELS_NUMBERS = range(0, 10)
export const DELEN_DIVISORS = range(1, 10)
export const BREUKEN_DENOMINATORS = [10, 50, 100] as const
export const MIN_RANGE_MAX = 1000

export function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}
