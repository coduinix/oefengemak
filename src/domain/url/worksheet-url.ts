import type { ExerciseType } from '@/domain/core'
import { MAX_TITLE_LENGTH, MAX_URL_LENGTH, type ExerciseConfig } from '@/domain/config'
import { getGenerator } from '@/domain/generators'
import { seedFromString, seedToString, type Seed } from '@/domain/rng'
import type { WorksheetSpec } from '@/domain/worksheet'
import { ParamReader, ParamWriter } from './params'
import { CURRENT_VERSION, migrate } from './versions'

export interface DecodedWorksheet {
  readonly spec: WorksheetSpec | null
  readonly config: ExerciseConfig
  readonly title: string
  readonly repaired: boolean
}

/** Total by contract: hand-edited links fall back to defaults rather than failing. */
export function decodeWorksheet(type: ExerciseType, search: URLSearchParams): DecodedWorksheet {
  const params = migrate(search)
  const reader = new ParamReader(params)
  const { config, repaired } = getGenerator(type).codec.fromParams(reader)
  const title = reader.text('t', MAX_TITLE_LENGTH)
  const seed = readSeed(params)

  return {
    config,
    title,
    repaired: repaired || reader.didRepair,
    spec: seed === null ? null : { title, seed, sections: [{ config }] },
  }
}

export function encodeWorksheet(
  config: ExerciseConfig,
  seed: Seed,
  title: string,
): URLSearchParams {
  const params = new URLSearchParams()
  params.set('v', String(CURRENT_VERSION))
  params.set('s', seedToString(seed))
  if (title !== '') params.set('t', title.slice(0, MAX_TITLE_LENGTH))
  getGenerator(config.type).codec.toParams(config as never, new ParamWriter(params))
  return params
}

export function buildWorksheetUrl(config: ExerciseConfig, seed: Seed, title: string): string {
  let params = encodeWorksheet(config, seed, title)
  let url = `/sommen/${config.type}?${params.toString()}`
  if (url.length > MAX_URL_LENGTH) {
    params = encodeWorksheet(config, seed, '')
    url = `/sommen/${config.type}?${params.toString()}`
  }
  if (url.length > MAX_URL_LENGTH) {
    throw new RangeError(`Worksheet URL exceeds ${MAX_URL_LENGTH} characters`)
  }
  return url
}

function readSeed(params: URLSearchParams): Seed | null {
  const raw = params.get('s')
  return raw === null ? null : seedFromString(raw)
}
