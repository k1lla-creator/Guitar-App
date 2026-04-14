import { ChordVisualizerAgent } from '@/lib/agents/chordVisualizer';
import { SongSeekerAgent } from '@/lib/agents/songSeeker';
import { StrumTranslatorAgent } from '@/lib/agents/strumTranslator';
import { TabTranslatorAgent } from '@/lib/agents/tabTranslator';
import { TheoryGuideAgent } from '@/lib/agents/theoryGuide';
import type { AnalysisResult } from '@/lib/types/song';
import { simplifyChord, simplifyProgression } from '@/lib/utils/chords';

export async function analyzeSong(input: {
  songTitle: string;
  artistName: string;
  simplifyForBeginners: boolean;
}): Promise<AnalysisResult> {
  const warnings: string[] = [];

  const songSeeker = new SongSeekerAgent();
  const tabTranslator = new TabTranslatorAgent();
  const strumTranslator = new StrumTranslatorAgent();
  const chordVisualizer = new ChordVisualizerAgent();
  const theoryGuide = new TheoryGuideAgent();

  const sourceResults = await songSeeker.run(input.songTitle, input.artistName);
  if (!sourceResults.chosen.extractedText) {
    warnings.push('Source extraction text was unavailable; used conservative parser defaults.');
  }

  const tab = await tabTranslator.run(sourceResults.chosen.extractedText ?? 'G D Em C');
  const normalizedTab = input.simplifyForBeginners
    ? {
        ...tab,
        uniqueChords: tab.uniqueChords.map(simplifyChord),
        sections: tab.sections.map((section) => ({
          ...section,
          progression: simplifyProgression(section.progression)
        }))
      }
    : tab;

  const strumming = await strumTranslator.run(normalizedTab.sections);
  const chordShapes = chordVisualizer.run(normalizedTab.uniqueChords);
  const theory = await theoryGuide.run(input.songTitle, input.artistName, normalizedTab.sections, normalizedTab.uniqueChords);

  return {
    songTitle: input.songTitle,
    artistName: input.artistName,
    source: sourceResults.chosen,
    tab: normalizedTab,
    strumming,
    chordShapes,
    theory,
    simplifyForBeginners: input.simplifyForBeginners,
    warnings
  };
}
