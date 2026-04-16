import { ChordVisualizerAgent } from '@/lib/agents/chordVisualizer';
import { SongSeekerAgent } from '@/lib/agents/songSeeker';
import { StrumTranslatorAgent } from '@/lib/agents/strumTranslator';
import { TabTranslatorAgent } from '@/lib/agents/tabTranslator';
import { TheoryGuideAgent } from '@/lib/agents/theoryGuide';
import type { AnalysisResult } from '@/lib/types/song';
import { simplifyChord, simplifyProgression } from '@/lib/utils/chords';

function logAgentStage(agentName: string, stage: 'start' | 'success' | 'error', details: string): void {
  const timestamp = new Date().toISOString();
  const prefix = `[Agent:${agentName}]`;
  if (stage === 'error') {
    console.error(`${timestamp} ${prefix} ${details}`);
    return;
  }

  console.info(`${timestamp} ${prefix} ${details}`);
}

async function runAgentWithLogging<T>(
  agentName: string,
  action: () => Promise<T> | T,
  detailBuilder: (result: T) => string
): Promise<T> {
  const startedAt = Date.now();
  logAgentStage(agentName, 'start', 'starting');

  try {
    const result = await action();
    const durationMs = Date.now() - startedAt;
    logAgentStage(agentName, 'success', `finished in ${durationMs}ms | ${detailBuilder(result)}`);
    return result;
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const message = error instanceof Error ? error.message : 'Unknown error';
    logAgentStage(agentName, 'error', `failed in ${durationMs}ms | ${message}`);
    throw error;
  }
}

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

  const sourceResults = await runAgentWithLogging(
    'SongSeekerAgent',
    () => songSeeker.run(input.songTitle, input.artistName),
    (result) => `selected source="${result.chosen.sourceName}", candidates=${result.candidates.length}`
  );
  if (!sourceResults.chosen.extractedText) {
    warnings.push('Source extraction text was unavailable; used conservative parser defaults.');
  }

  const tab = await runAgentWithLogging(
    'TabTranslatorAgent',
    () => tabTranslator.run(sourceResults.chosen.extractedText ?? 'G D Em C'),
    (result) => `uniqueChords=${result.uniqueChords.length}, sections=${result.sections.length}, parserConfidence=${result.parserConfidence}`
  );
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

  const strumming = await runAgentWithLogging(
    'StrumTranslatorAgent',
    () => strumTranslator.run(normalizedTab.sections),
    (result) => `recommendedPattern="${result.recommendedPattern}"`
  );

  const theory = await runAgentWithLogging(
    'TheoryGuideAgent',
    () => theoryGuide.run(input.songTitle, input.artistName, normalizedTab.sections, normalizedTab.uniqueChords),
    (result) => `likelyKey="${result.likelyKey}", romanNumerals=${result.romanNumerals.length}`
  );

  const chordShapes = await runAgentWithLogging(
    'ChordVisualizerAgent',
    () => chordVisualizer.run(normalizedTab.uniqueChords, {
      sections: normalizedTab.sections,
      simplifyForBeginners: input.simplifyForBeginners,
      songStyleHint: theory.harmonicFeel
    }),
    (result) => `renderedShapes=${result.length}`
  );

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
