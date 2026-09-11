import type { ExerciseType, ValidationIssue } from '@/domain/core'
import { issueMessage } from '@/i18n/nl'

export function fieldError(
  issues: readonly ValidationIssue[],
  field: string,
  type: ExerciseType,
): string | undefined {
  const match = issues.find((issue) => issue.field === field)
  return match === undefined ? undefined : issueMessage(match, type)
}

/**
 * Everything the type's options component does not show inline. Issues are surfaced exactly once:
 * next to their field where a component claims it, above the buttons otherwise.
 */
export function formLevelIssues(
  issues: readonly ValidationIssue[],
  inlineFields: readonly string[],
): readonly ValidationIssue[] {
  return issues.filter((issue) => issue.field === undefined || !inlineFields.includes(issue.field))
}
