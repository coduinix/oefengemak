import type { Section, Worksheet } from '@/domain/core'
import type { ExerciseConfig } from '@/domain/config'
import { deriveRng, type Rng } from '@/domain/rng'
import { assemble, planBlocks } from '@/domain/layout'
import { generatorFor } from '@/domain/generators'
import type { WorksheetSpec } from './worksheet-spec'

export function generateSection(config: ExerciseConfig, rng: Rng, id: string): Section {
  const generator = generatorFor(config)
  if (!generator.validate(config as never).ok) return { id, type: config.type, blocks: [] }

  const plans = planBlocks(generator.layout(config as never))
  const sources = generator.sources(config as never)
  return { id, type: config.type, blocks: assemble(plans, sources, rng, id) }
}

export function generateWorksheet(spec: WorksheetSpec): Worksheet {
  return {
    title: spec.title,
    sections: spec.sections.map((section, index) =>
      generateSection(
        section.config,
        deriveRng(spec.seed, `${index}:${section.config.type}`),
        `s${index}`,
      ),
    ),
  }
}
