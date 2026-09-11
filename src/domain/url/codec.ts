import type { ParamReader, ParamWriter } from './params'

export interface DecodeOutcome<C> {
  readonly config: C
  /** True when a param was missing, malformed or out of range and a default was substituted. */
  readonly repaired: boolean
}

export interface ConfigCodec<C> {
  toParams(config: C, writer: ParamWriter): void
  fromParams(reader: ParamReader): DecodeOutcome<C>
}
