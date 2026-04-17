export type AnalyzeRequest = {
  songTitle: string;
  artistName: string;
  simplifyForBeginners?: boolean;
};

export type SourceCandidate = {
  sourceName: string;
  url: string;
  title: string;
  artist: string;
  songTitle?: string;
  versionLabel?: string;
  confidenceScore?: number;
  matchReason?: string;
  artistMatchConfidence: number;
  extractedText?: string;
};

export type SongSeekerResult = {
  candidates: SourceCandidate[];
  chosen?: SourceCandidate;
  requiresConfirmation: boolean;
  ambiguityReason?: string;
  notes?: string;
};

export type SectionProgression = {
  section: string;
  progression: string[];
  repeatedFrom?: string;
};

export type TabTranslation = {
  uniqueChords: string[];
  sections: SectionProgression[];
  parserConfidence: number;
  notes: string;
};

export type StrummingResult = {
  recommendedPattern: string;
  easierPattern: string;
  feelTempo: string;
  confidenceNote: string;
};


export type VoicingSource = {
  provider: string;
  url?: string;
  fetchedAt?: string;
};

export type ChordVoicing = {
  chord: string;
  label: string;
  frets: Array<number | 'x'>;
  fingers: Array<number | null>;
  difficulty: 'easy' | 'medium' | 'hard';
  neckPosition: string;
  styleTags?: string[];
  recommendationReason?: string;
  baseFret?: number;
  source: VoicingSource;
};

export type ChordShape = {
  chord: string;
  voicings: ChordVoicing[];
  recommendedVoicingIndex: number;
  recommendationReason: string;
};

export type ChordShape = {
  chord: string;
  voicings: ChordVoicing[];
  recommendedVoicingIndex: number;
  recommendationReason: string;
};

export type TheoryResult = {
  likelyKey: string;
  relativeKey?: string;
  romanNumerals: string[];
  relatedDiatonicChords: string[];
  circleOfFifthsContext: string;
  modalColor: string;
  harmonicFeel: string;
  whyItWorks: string;
  uncertaintyNote: string;
};

export type AnalysisResult = {
  songTitle: string;
  artistName: string;
  source: SourceCandidate;
  tab: TabTranslation;
  strumming: StrummingResult;
  chordShapes: ChordShape[];
  theory: TheoryResult;
  simplifyForBeginners: boolean;
  warnings: string[];
};
