import { MAX_SEED, type Seed } from '@/domain/rng'

/** The one deliberate source of nondeterminism: picking a seed when the user asks for new sums. */
export function randomSeed(): Seed {
  return Math.floor(Math.random() * (MAX_SEED + 1)) >>> 0
}
