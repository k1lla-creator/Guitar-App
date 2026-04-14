import { z } from 'zod';
import { getOpenAIClient } from '@/lib/openai/client';
import type { SectionProgression, TabTranslation } from '@/lib/types/song';

const tabSchema = z.object({
  uniqueChords: z.array(z.string()),
  sections: z.array(
    z.object({
      section: z.string(),
      progression: z.array(z.string()),
      repeatedFrom: z.string().optional()
    })
  ),
  parserConfidence: z.number().min(0).max(1),
  notes: z.string()
});

function fallbackParse(rawText: string): TabTranslation {
  const chordMatches = rawText.match(/\b[A-G](#|b)?(m|maj7|m7|sus4|add9|7)?\b/g) ?? [];
  const unique = [...new Set(chordMatches)];
  const section: SectionProgression = {
    section: 'Main progression',
    progression: unique.length ? unique.slice(0, 4) : ['G', 'D', 'Em', 'C']
  };

  return {
    uniqueChords: unique.length ? unique : ['G', 'D', 'Em', 'C'],
    sections: [section],
    parserConfidence: 0.58,
    notes: 'Fallback parser used due to unavailable model output.'
  };
}

export class TabTranslatorAgent {
  async run(rawTabText: string): Promise<TabTranslation> {
    const client = getOpenAIClient();
    if (!client) return fallbackParse(rawTabText);

    try {
      const response = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              'Extract guitar chords and sections from tab text. Return strict JSON matching schema.'
          },
          { role: 'user', content: rawTabText }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'tab_translation',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                uniqueChords: { type: 'array', items: { type: 'string' } },
                sections: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      section: { type: 'string' },
                      progression: { type: 'array', items: { type: 'string' } },
                      repeatedFrom: { type: 'string' }
                    },
                    required: ['section', 'progression']
                  }
                },
                parserConfidence: { type: 'number' },
                notes: { type: 'string' }
              },
              required: ['uniqueChords', 'sections', 'parserConfidence', 'notes']
            },
            strict: true
          }
        }
      });

      const parsed = JSON.parse(response.output_text);
      return tabSchema.parse(parsed);
    } catch {
      return fallbackParse(rawTabText);
    }
  }
}
