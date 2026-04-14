import { z } from 'zod';
import { getOpenAIClient } from '@/lib/openai/client';
import type { SectionProgression, StrummingResult } from '@/lib/types/song';

const schema = z.object({
  recommendedPattern: z.string(),
  easierPattern: z.string(),
  feelTempo: z.string(),
  confidenceNote: z.string()
});

function fallbackStrum(sections: SectionProgression[]): StrummingResult {
  const hasBallad = sections.some((s) => /chorus|verse/i.test(s.section));
  return {
    recommendedPattern: hasBallad ? 'D D U U D U' : 'D U D U',
    easierPattern: 'D D D D',
    feelTempo: hasBallad ? 'Steady mid-tempo, lightly accented downbeats.' : 'Even groove, moderate tempo.',
    confidenceNote: 'Pattern inferred from progression style; original recording may differ.'
  };
}

export class StrumTranslatorAgent {
  async run(sections: SectionProgression[]): Promise<StrummingResult> {
    const client = getOpenAIClient();
    if (!client) return fallbackStrum(sections);

    try {
      const response = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: `Infer likely guitar strumming patterns for this progression: ${JSON.stringify(sections)}`,
        text: {
          format: {
            type: 'json_schema',
            name: 'strum_translation',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                recommendedPattern: { type: 'string' },
                easierPattern: { type: 'string' },
                feelTempo: { type: 'string' },
                confidenceNote: { type: 'string' }
              },
              required: ['recommendedPattern', 'easierPattern', 'feelTempo', 'confidenceNote']
            },
            strict: true
          }
        }
      });

      return schema.parse(JSON.parse(response.output_text));
    } catch {
      return fallbackStrum(sections);
    }
  }
}
