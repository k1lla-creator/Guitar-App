import type { ChordShape, ChordVoicing, SectionProgression } from '@/lib/types/song';
import { getChordVoicings } from '@/lib/chords/knowledge';

type RecommendationContext = {
  sections: SectionProgression[];
  simplifyForBeginners: boolean;
  songStyleHint?: string;
};

const chordVoicingLibrary: Record<string, ChordVoicing[]> = {
  C: [
    {
      chord: 'C',
      label: 'Open C major',
      frets: ['x', 3, 2, 0, 1, 0],
      fingers: [null, 3, 2, null, 1, null],
      difficulty: 'easy',
      neckPosition: 'Open position',
      styleTags: ['pop', 'folk', 'acoustic']
    },
    {
      chord: 'C',
      label: 'A-shape barre',
      frets: ['x', 3, 5, 5, 5, 3],
      fingers: [null, 1, 3, 4, 2, 1],
      difficulty: 'hard',
      neckPosition: '3rd fret',
      styleTags: ['rock', 'soul'],
      baseFret: 3
    },
    {
      chord: 'C',
      label: 'Triad high voicing',
      frets: ['x', 'x', 10, 9, 8, 'x'],
      fingers: [null, null, 3, 2, 1, null],
      difficulty: 'medium',
      neckPosition: '8th fret',
      styleTags: ['indie', 'studio'],
      baseFret: 8
    }
  ],
  G: [
    {
      chord: 'G',
      label: 'Open G major',
      frets: [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, null, null, null, 3],
      difficulty: 'easy',
      neckPosition: 'Open position',
      styleTags: ['pop', 'folk', 'acoustic']
    },
    {
      chord: 'G',
      label: '4-finger G',
      frets: [3, 2, 0, 0, 3, 3],
      fingers: [2, 1, null, null, 3, 4],
      difficulty: 'medium',
      neckPosition: 'Open position',
      styleTags: ['country', 'rhythm']
    },
    {
      chord: 'G',
      label: 'E-shape barre',
      frets: [3, 5, 5, 4, 3, 3],
      fingers: [1, 3, 4, 2, 1, 1],
      difficulty: 'hard',
      neckPosition: '3rd fret',
      styleTags: ['rock'],
      baseFret: 3
    }
  ],
  D: [
    {
      chord: 'D',
      label: 'Open D major',
      frets: ['x', 'x', 0, 2, 3, 2],
      fingers: [null, null, null, 1, 3, 2],
      difficulty: 'easy',
      neckPosition: 'Open position',
      styleTags: ['pop', 'folk']
    },
    {
      chord: 'D',
      label: 'A-shape barre',
      frets: ['x', 5, 7, 7, 7, 5],
      fingers: [null, 1, 3, 4, 2, 1],
      difficulty: 'hard',
      neckPosition: '5th fret',
      styleTags: ['rock'],
      baseFret: 5
    }
  ],
  Em: [
    {
      chord: 'Em',
      label: 'Open Em',
      frets: [0, 2, 2, 0, 0, 0],
      fingers: [null, 2, 3, null, null, null],
      difficulty: 'easy',
      neckPosition: 'Open position',
      styleTags: ['pop', 'folk', 'ambient']
    },
    {
      chord: 'Em',
      label: '7th-fret voicing',
      frets: ['x', 7, 9, 9, 8, 7],
      fingers: [null, 1, 3, 4, 2, 1],
      difficulty: 'hard',
      neckPosition: '7th fret',
      styleTags: ['soul', 'jazz'],
      baseFret: 7
    }
  ],
  Am: [
    {
      chord: 'Am',
      label: 'Open Am',
      frets: ['x', 0, 2, 2, 1, 0],
      fingers: [null, null, 2, 3, 1, null],
      difficulty: 'easy',
      neckPosition: 'Open position',
      styleTags: ['pop', 'folk', 'ballad']
    },
    {
      chord: 'Am',
      label: 'E-shape barre',
      frets: [5, 7, 7, 5, 5, 5],
      fingers: [1, 3, 4, 1, 1, 1],
      difficulty: 'hard',
      neckPosition: '5th fret',
      styleTags: ['rock', 'soul'],
      baseFret: 5
    }
  ],
  A: [
    {
      chord: 'A',
      label: 'Open A major',
      frets: ['x', 0, 2, 2, 2, 0],
      fingers: [null, null, 1, 2, 3, null],
      difficulty: 'easy',
      neckPosition: 'Open position',
      styleTags: ['pop', 'country']
    },
    {
      chord: 'A',
      label: 'E-shape barre',
      frets: [5, 7, 7, 6, 5, 5],
      fingers: [1, 3, 4, 2, 1, 1],
      difficulty: 'hard',
      neckPosition: '5th fret',
      styleTags: ['rock', 'funk'],
      baseFret: 5
    }
  ],
  E: [
    {
      chord: 'E',
      label: 'Open E major',
      frets: [0, 2, 2, 1, 0, 0],
      fingers: [null, 2, 3, 1, null, null],
      difficulty: 'easy',
      neckPosition: 'Open position',
      styleTags: ['blues', 'rock', 'folk']
    },
    {
      chord: 'E',
      label: 'A-shape barre',
      frets: ['x', 7, 9, 9, 9, 7],
      fingers: [null, 1, 3, 4, 2, 1],
      difficulty: 'hard',
      neckPosition: '7th fret',
      styleTags: ['funk', 'soul'],
      baseFret: 7
    }
  ],
  F: [
    {
      chord: 'F',
      label: 'Easy Fmaj7',
      frets: ['x', 'x', 3, 2, 1, 0],
      fingers: [null, null, 3, 2, 1, null],
      difficulty: 'easy',
      neckPosition: 'Open position',
      styleTags: ['ballad', 'acoustic']
    },
    {
      chord: 'F',
      label: 'Mini barre F',
      frets: ['x', 'x', 3, 2, 1, 1],
      fingers: [null, null, 3, 2, 1, 1],
      difficulty: 'medium',
      neckPosition: '1st fret',
      styleTags: ['pop', 'rock']
    },
    {
      chord: 'F',
      label: 'Full barre F',
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      difficulty: 'hard',
      neckPosition: '1st fret',
      styleTags: ['rock', 'soul'],
      baseFret: 1
    }
  ],
  Fmaj7: [
    {
      chord: 'Fmaj7',
      label: 'Open Fmaj7',
      frets: ['x', 'x', 3, 2, 1, 0],
      fingers: [null, null, 3, 2, 1, null],
      difficulty: 'easy',
      neckPosition: 'Open position',
      styleTags: ['ballad']
    }
  ],
  Bm7: [
    {
      chord: 'Bm7',
      label: 'Bm7 barre',
      frets: ['x', 2, 4, 2, 3, 2],
      fingers: [null, 1, 3, 1, 2, 1],
      difficulty: 'medium',
      neckPosition: '2nd fret',
      styleTags: ['pop', 'soul'],
      baseFret: 2
    }
  ]
};

function approximateFretCenter(voicing: ChordVoicing): number {
  const fretted = voicing.frets.filter((fret) => typeof fret === 'number' && fret > 0) as number[];
  if (!fretted.length) return 1;
  return Math.round(fretted.reduce((sum, fret) => sum + fret, 0) / fretted.length);
}

function detectStyleHints(songStyleHint: string | undefined, sections: SectionProgression[]): string[] {
  const sectionNames = sections.map((section) => section.section.toLowerCase()).join(' ');
  const mood = (songStyleHint ?? '').toLowerCase();
  const hints = new Set<string>();

  if (/hymn|warm|ballad|reassuring/.test(mood)) hints.add('ballad');
  if (/driving|rock/.test(mood)) hints.add('rock');
  if (/nostalgic|open-voiced|acoustic/.test(mood)) hints.add('acoustic');
  if (/folk|country/.test(mood)) hints.add('folk');
  if (/soul|groove/.test(mood)) hints.add('soul');
  if (/verse|chorus/.test(sectionNames)) hints.add('pop');

  return [...hints];
}

function scoreVoicing(
  voicing: ChordVoicing,
  simplifyForBeginners: boolean,
  styleHints: string[],
  transitionTarget: number
): number {
  let score = 50;

  if (simplifyForBeginners) {
    if (voicing.difficulty === 'easy') score += 24;
    if (voicing.difficulty === 'medium') score += 8;
    if (voicing.difficulty === 'hard') score -= 20;

    if (voicing.neckPosition.toLowerCase().includes('open')) score += 14;
  } else if (voicing.difficulty === 'medium') {
    score += 6;
  } else {
    if (voicing.difficulty === 'medium') score += 6;
  }

  const styleMatches = voicing.styleTags?.filter((tag) => styleHints.includes(tag)).length ?? 0;
  score += styleMatches * 8;

  const center = approximateFretCenter(voicing);
  const distance = Math.abs(center - transitionTarget);
  score += Math.max(0, 12 - distance * 2);

  return score;
}

function buildRecommendationReason(
  voicing: ChordVoicing,
  simplifyForBeginners: boolean,
  styleHints: string[],
  transitionTarget: number
): string {
  const notes: string[] = [];

  if (simplifyForBeginners && voicing.difficulty === 'easy') {
    notes.push('uses a beginner-friendly fingering');
    notes.push('beginner-friendly fingering with low hand strain');
  }

  if (styleHints.length) {
    const matchingStyle = voicing.styleTags?.find((tag) => styleHints.includes(tag));
    if (matchingStyle) notes.push(`fits the song’s ${matchingStyle} feel`);
  }

  const center = approximateFretCenter(voicing);
  if (Math.abs(center - transitionTarget) <= 2) {
    notes.push('keeps transitions smooth from neighboring chords');
  }

  if (voicing.neckPosition.toLowerCase().includes('open')) {
    notes.push('stays in open position for easier movement');
  }

  if (voicing.source.provider.toLowerCase().includes('cached')) {
    notes.push('comes from cached chord knowledge for fast loading');
    notes.push('stays in open position for quick chord changes');
  } else {
    notes.push(`keeps your hand around the ${voicing.neckPosition.toLowerCase()}`);
  }

  const reason = notes.slice(0, 2).join(' and ');
  return reason ? `Recommended because it ${reason}.` : 'Recommended for balanced playability in this progression.';
}

export class ChordVisualizerAgent {
  async run(chords: string[], context: RecommendationContext): Promise<ChordShape[]> {
  run(chords: string[], context: RecommendationContext): ChordShape[] {
    const styleHints = detectStyleHints(context.songStyleHint, context.sections);
    const progression = context.sections.flatMap((section) => section.progression);
    const firstSeenOrder = new Map<string, number>();

    progression.forEach((chord, index) => {
      if (!firstSeenOrder.has(chord)) firstSeenOrder.set(chord, index);
    });

    return Promise.all(
      chords.map(async (chord) => {
        const voicings = await getChordVoicings(chord);
        const progressionSpot = firstSeenOrder.get(chord) ?? 0;
        const previousChord = progressionSpot > 0 ? progression[progressionSpot - 1] : undefined;
        const previousVoicing = previousChord ? (await getChordVoicings(previousChord))[0] : undefined;
        const transitionTarget = previousVoicing ? approximateFretCenter(previousVoicing) : 2;

        let bestIndex = 0;
        let bestScore = Number.NEGATIVE_INFINITY;
        voicings.forEach((voicing, index) => {
          const score = scoreVoicing(voicing, context.simplifyForBeginners, styleHints, transitionTarget);
          if (score > bestScore) {
            bestScore = score;
            bestIndex = index;
          }
        });

        const recommendedVoicing = voicings[bestIndex];
        const recommendationReason =
          recommendedVoicing.recommendationReason ??
          buildRecommendationReason(recommendedVoicing, context.simplifyForBeginners, styleHints, transitionTarget);

        const enrichedVoicings = voicings.map((voicing, index) =>
          index === bestIndex ? { ...voicing, recommendationReason } : voicing
        );

        return {
          chord,
          voicings: enrichedVoicings,
          recommendedVoicingIndex: bestIndex,
          recommendationReason
        };
      })
    );
    return chords.map((chord) => {
      const voicings = chordVoicingLibrary[chord] ?? [
        {
          chord,
          label: `${chord} (default)`,
          frets: ['x', 'x', 0, 0, 0, 0],
          fingers: [null, null, null, null, null, null],
          difficulty: 'easy',
          neckPosition: 'Open position',
          recommendationReason: 'Fallback voicing used because this chord is not yet in the library.'
        }
      ];

      const progressionSpot = firstSeenOrder.get(chord) ?? 0;
      const previousChord = progressionSpot > 0 ? progression[progressionSpot - 1] : undefined;
      const previousVoicing = previousChord ? chordVoicingLibrary[previousChord]?.[0] : undefined;
      const transitionTarget = previousVoicing ? approximateFretCenter(previousVoicing) : 2;

      let bestIndex = 0;
      let bestScore = Number.NEGATIVE_INFINITY;
      voicings.forEach((voicing, index) => {
        const score = scoreVoicing(voicing, context.simplifyForBeginners, styleHints, transitionTarget);
        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });

      const recommendedVoicing = voicings[bestIndex];
      const recommendationReason = recommendedVoicing.recommendationReason ??
        buildRecommendationReason(recommendedVoicing, context.simplifyForBeginners, styleHints, transitionTarget);

      const enrichedVoicings = voicings.map((voicing, index) =>
        index === bestIndex
          ? { ...voicing, recommendationReason }
          : voicing
      );

      return {
        chord,
        voicings: enrichedVoicings,
        recommendedVoicingIndex: bestIndex,
        recommendationReason
      };
    });
  }
}
