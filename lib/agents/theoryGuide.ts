import { z } from 'zod';
import { getOpenAIClient } from '@/lib/openai/client';
import { mockKey } from '@/lib/mock/songMocks';
import type { SectionProgression, TheoryResult } from '@/lib/types/song';

const theorySchema = z.object({
  likelyKey: z.string(),
  relativeKey: z.string().optional(),
  romanNumerals: z.array(z.string()),
  relatedDiatonicChords: z.array(z.string()),
  circleOfFifthsContext: z.string(),
  modalColor: z.string(),
  harmonicFeel: z.string(),
  whyItWorks: z.string(),
  uncertaintyNote: z.string()
});

function fallbackTheory(songTitle: string, artistName: string, chords: string[]): TheoryResult {
  const mock = mockKey(songTitle, artistName);
  return {
    likelyKey: mock.key,
    relativeKey: 'Relative major/minor is inferred from common-pop harmony patterns.',
    romanNumerals: ['I', 'V', 'vi', 'IV'],
    relatedDiatonicChords: chords.slice(0, 6),
    circleOfFifthsContext: 'Progression movement suggests nearby keys on the circle of fifths with gentle tension-release.',
    modalColor: 'Possible mixolydian or dorian color if flattened scale tones appear in verses.',
    harmonicFeel: mock.mood,
    whyItWorks: 'The chords likely balance stability and motion by alternating tonic-area and dominant-area harmony.',
    uncertaintyNote: 'Theory is inferred from extracted chords and may vary by arrangement or capo position.'
  };
}

export class TheoryGuideAgent {
  async run(songTitle: string, artistName: string, sections: SectionProgression[], chords: string[]): Promise<TheoryResult> {
    const client = getOpenAIClient();
    if (!client) return fallbackTheory(songTitle, artistName, chords);

    try {
      const response = await client.responses.create({
        model: 'gpt-4.1-mini',
        input: `Analyze this harmony for beginners. sections=${JSON.stringify(sections)} chords=${JSON.stringify(chords)}`,
        text: {
          format: {
            type: 'json_schema',
            name: 'theory_guide',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                likelyKey: { type: 'string' },
                relativeKey: { type: 'string' },
                romanNumerals: { type: 'array', items: { type: 'string' } },
                relatedDiatonicChords: { type: 'array', items: { type: 'string' } },
                circleOfFifthsContext: { type: 'string' },
                modalColor: { type: 'string' },
                harmonicFeel: { type: 'string' },
                whyItWorks: { type: 'string' },
                uncertaintyNote: { type: 'string' }
              },
              required: ['likelyKey', 'romanNumerals', 'relatedDiatonicChords', 'circleOfFifthsContext', 'modalColor', 'harmonicFeel', 'whyItWorks', 'uncertaintyNote']
            },
            strict: true
          }
        }
      });

      return theorySchema.parse(JSON.parse(response.output_text));
    } catch {
      return fallbackTheory(songTitle, artistName, chords);
    }
  }
}
