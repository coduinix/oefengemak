const FNV_OFFSET = 0x811c9dc5
const FNV_PRIME = 0x01000193

export function hashString(input: string, seed = FNV_OFFSET): number {
  let h = seed >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, FNV_PRIME) >>> 0
  }
  return h >>> 0
}

export function mix(a: number, b: number): number {
  let h = (a ^ b) >>> 0
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0
  return (h ^ (h >>> 16)) >>> 0
}
