export type IssueCode = 'EMPTY_SELECTION' | 'TOO_MANY_EXERCISES' | 'NO_EXERCISES' | 'INVALID_FIELD'

export interface ValidationIssue {
  readonly code: IssueCode
  readonly field?: string
}

export type Result<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly issues: readonly ValidationIssue[] }

export const ok = <T>(value: T): Result<T> => ({ ok: true, value })
export const err = <T>(issues: readonly ValidationIssue[]): Result<T> => ({ ok: false, issues })
export const issue = (code: IssueCode, field?: string): ValidationIssue =>
  field === undefined ? { code } : { code, field }

/** Thrown when a sampler cannot satisfy its predicate; a bug in a generator, not user input. */
export class GenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GenerationError'
  }
}
