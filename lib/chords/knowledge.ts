import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import type { ChordVoicing } from '@/lib/types/song';
import { localChordVoicingLibrary } from '@/lib/chords/localVoicings';
import { normalizeQuality, parseChordSymbol, rootToDatasetKey } from '@/lib/chords/detection';

const CACHE_FILE = path.join(process.cwd(), '.cache', 'chord-voicings.json');
const DATASET_URL = 'https://raw.githubusercontent.com/tombatossals/chords-db/master/lib/guitar.json';

const voicingSchema = z.object({
  chord: z.string().min(1),
  label: z.string().min(1),
  frets: z.array(z.union([z.number().int(), z.literal('x')])).length(6),
  fingers: z.array(z.union([z.number().int(), z.null()])).length(6),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  neckPosition: z.string().min(1),
  styleTags: z.array(z.string()).optional(),
  recommendationReason: z.string().optional(),
  baseFret: z.number().int().optional(),
  source: z.object({
    provider: z.string(),
    url: z.string().optional(),
    fetchedAt: z.string().optional()
  })
});

type RemoteDataset = {
  chords?: Record<string, Array<{ suffix: string; positions: Array<{ frets: number[]; fingers?: number[]; barres?: number[]; baseFret?: number }> }>>;
};

let datasetCache: RemoteDataset | null = null;
let memoryCache: Record<string, ChordVoicing[]> | null = null;

async function loadCache(): Promise<Record<string, ChordVoicing[]>> {
  if (memoryCache) return memoryCache;
  try {
    const raw = await readFile(CACHE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Record<string, ChordVoicing[]>;
    memoryCache = parsed;
    return parsed;
  } catch {
    memoryCache = {};
    return memoryCache;
  }
}

async function saveCache(cache: Record<string, ChordVoicing[]>): Promise<void> {
  memoryCache = cache;
  try {
    await mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch {
    // Non-fatal in environments without write permissions.
  }
}

function scoreDifficulty(frets: Array<number | 'x'>, barresCount: number): 'easy' | 'medium' | 'hard' {
  const numericFrets = frets.filter((fret): fret is number => typeof fret === 'number' && fret > 0);
  const avg = numericFrets.length ? numericFrets.reduce((sum, fret) => sum + fret, 0) / numericFrets.length : 1;
  if (barresCount >= 1 || avg > 6) return 'hard';
  if (avg > 3) return 'medium';
  return 'easy';
}

function normalizePosition(raw: { frets: number[]; fingers?: number[]; barres?: number[]; baseFret?: number }, chordName: string, index: number, suffix: string): ChordVoicing | null {
  if (!raw.frets || raw.frets.length < 6) return null;
  const frets = raw.frets.slice(0, 6).map((fret) => (fret < 0 ? 'x' : fret));
  const hasAnyFretted = frets.some((fret) => typeof fret === 'number' && fret > 0);
  if (!hasAnyFretted) return null;

  const fingers = (raw.fingers ?? [0, 0, 0, 0, 0, 0]).slice(0, 6).map((finger) => (finger > 0 ? finger : null));
  while (fingers.length < 6) fingers.push(null);

  const difficulty = scoreDifficulty(frets, raw.barres?.length ?? 0);
  const baseFret = raw.baseFret && raw.baseFret > 1 ? raw.baseFret : undefined;

  const voicing: ChordVoicing = {
    chord: chordName,
    label: `${suffix} voicing ${index + 1}`,
    frets,
    fingers,
    difficulty,
    neckPosition: baseFret ? `${baseFret}th fret` : 'Open position',
    baseFret,
    source: {
      provider: 'chords-db (GitHub dataset)',
      url: DATASET_URL,
      fetchedAt: new Date().toISOString()
    }
  };

  const validated = voicingSchema.safeParse(voicing);
  return validated.success ? validated.data : null;
}

async function fetchRemoteDataset(): Promise<RemoteDataset | null> {
  if (datasetCache) return datasetCache;

  try {
    const response = await fetch(DATASET_URL, { cache: 'no-store' });
    if (!response.ok) return null;
    datasetCache = (await response.json()) as RemoteDataset;
    return datasetCache;
  } catch {
    return null;
  }
}

function suffixCandidates(quality: string): string[] {
  const fallback: Record<string, string[]> = {
    major: ['major'],
    minor: ['minor', 'm'],
    m7: ['m7', 'minor7'],
    maj7: ['maj7', 'major7'],
    sus2: ['sus2'],
    sus4: ['sus4', 'sus'],
    add9: ['add9'],
    '7': ['7'],
    '9': ['9']
  };

  return fallback[quality] ?? [quality, 'major'];
}

async function lookupRemoteVoicings(chordName: string): Promise<ChordVoicing[]> {
  const dataset = await fetchRemoteDataset();
  if (!dataset?.chords) return [];

  const parsed = parseChordSymbol(chordName);
  const rootKey = rootToDatasetKey(parsed.root);
  const quality = normalizeQuality(parsed.quality, parsed.bassNote);

  const entries = dataset.chords[rootKey] ?? [];
  const candidates = suffixCandidates(quality);

  const entry = entries.find((item) => candidates.includes(item.suffix));
  if (!entry) return [];

  return entry.positions
    .slice(0, 6)
    .map((position, index) => normalizePosition(position, chordName, index, entry.suffix))
    .filter((item): item is ChordVoicing => item !== null);
}

export async function getChordVoicings(chordName: string): Promise<ChordVoicing[]> {
  const local = localChordVoicingLibrary[chordName];
  if (local?.length) return local;

  const cache = await loadCache();
  if (cache[chordName]?.length) {
    return cache[chordName].map((voicing) => ({
      ...voicing,
      source: { ...voicing.source, provider: `${voicing.source.provider} (cached)` }
    }));
  }

  const online = await lookupRemoteVoicings(chordName);
  if (online.length) {
    cache[chordName] = online;
    await saveCache(cache);
    return online;
  }

  return [
    {
      chord: chordName,
      label: `${chordName} (default)`,
      frets: ['x', 'x', 0, 0, 0, 0],
      fingers: [null, null, null, null, null, null],
      difficulty: 'easy',
      neckPosition: 'Open position',
      recommendationReason: 'Fallback voicing used because chord knowledge is unavailable.',
      source: {
        provider: 'Fallback generator',
        url: 'local://fallback'
      }
    }
  ];
}
