import type { ChordShape, ChordVoicing, SectionProgression } from '@/lib/types/song';
import { getChordVoicings } from '@/lib/chords/knowledge';

type RecommendationContext = {
  sections: SectionProgression[];
  simplifyForBeginners: boolean;
  songStyleHint?: string;
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
  }

  const reason = notes.slice(0, 2).join(' and ');
  return reason ? `Recommended because it ${reason}.` : 'Recommended for balanced playability in this progression.';
}

export class ChordVisualizerAgent {
  async run(chords: string[], context: RecommendationContext): Promise<ChordShape[]> {
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
  }
}
