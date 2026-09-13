// Kept in sync by hand with the literal `210mm`/`297mm` in print.css and src/styles/index.css.
export const A4_WIDTH_MM = 210
export const A4_HEIGHT_MM = 297

const MM_PER_PX = 96 / 25.4

export function mmToPx(mm: number): number {
  return mm * MM_PER_PX
}

export const A4_WIDTH_PX = mmToPx(A4_WIDTH_MM)
export const A4_HEIGHT_PX = mmToPx(A4_HEIGHT_MM)
