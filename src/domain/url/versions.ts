export const CURRENT_VERSION = 1

type Migration = (params: URLSearchParams) => URLSearchParams

const MIGRATIONS: Readonly<Record<number, Migration>> = {}

export function readVersion(params: URLSearchParams): number {
  const raw = params.get('v')
  if (raw === null) return CURRENT_VERSION
  const parsed = Number(raw)
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : CURRENT_VERSION
}

/** Applied before schema parsing, so Zod only ever sees the current shape. */
export function migrate(params: URLSearchParams): URLSearchParams {
  let current = new URLSearchParams(params)
  for (let v = readVersion(params); v < CURRENT_VERSION; v++) {
    const migration = MIGRATIONS[v]
    if (migration === undefined) break
    current = migration(current)
  }
  return current
}
