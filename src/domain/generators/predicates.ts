import { isInt, type Exercise } from '@/domain/core'

/**
 * True when adding the units columns does not carry into the tens. The legacy site produced this
 * by forcing lhs >= 10; stating it as a rule is what makes it testable. See ADR 0006.
 */
export function noTensCrossing(exercise: Exercise): boolean {
  if (!isInt(exercise.lhs) || !isInt(exercise.rhs)) return true
  return (exercise.lhs.value % 10) + (exercise.rhs.value % 10) <= 10
}
