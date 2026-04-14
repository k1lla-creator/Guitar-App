# SongSeeker AI

A production-quality MVP for a guitar learning assistant that helps players:

1. Find likely tab/chord sources for a song.
2. Parse chords + sections.
3. Infer practical strumming patterns.
4. Visualize chord shapes.
5. Understand the underlying theory.

Tagline: **Find it. Understand it. Play it.**

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS (dark mode-first premium UI)
- **Backend:** Next.js API route (`/api/analyze`) + service layer orchestration
- **AI:** OpenAI JS SDK using the **Responses API** with structured JSON schema output
- **Validation:** Zod
- **Tests:** Vitest

## MVP Architecture

```text
app/
  api/analyze/route.ts         # API entrypoint
  page.tsx                     # Homepage
  results/page.tsx             # Results route shell
components/
  AnalyzeForm.tsx              # Hero input card
  ResultsClient.tsx            # Async fetch + loading/error state
  ResultsDashboard.tsx         # Unified tabs UX
  ChordDiagram.tsx             # SVG chord visuals
lib/
  agents/
    songSeeker.ts              # Source discovery via provider interface
    tabTranslator.ts           # Chord/section extraction (OpenAI + fallback)
    strumTranslator.ts         # Strum inference (OpenAI + fallback)
    chordVisualizer.ts         # Chord shape generation
    theoryGuide.ts             # Theory analysis (OpenAI + fallback)
  orchestrator/analyzeSong.ts  # Pipeline coordinator + uncertainty handling
  mock/songMocks.ts            # Realistic sample data for reliable MVP behavior
  openai/client.ts             # OpenAI client factory
  types/                       # Shared type-safe contracts
  utils/chords.ts              # Beginner simplification helpers
tests/
  chords.test.ts
  agents.test.ts
  e2e-mocked-flow.test.ts
```

## Agent Responsibilities

### 1) SongSeeker
- Input: song title + artist
- Output: ranked source candidates (name, URL, title, confidence, extracted text)
- MVP implementation: pluggable provider interface with a mock provider
- Extension point: add live source adapters where `SongProvider` is defined

### 2) TabTranslator
- Input: selected tab/chord text
- Output: unique chords, section breakdown, progression, confidence/notes
- Uses OpenAI Responses API + strict JSON schema where available
- Falls back to robust regex parser when model/API is unavailable

### 3) StrumTranslator
- Input: parsed sections/progressions
- Output: main pattern, easier variant, feel/tempo, confidence note
- Uses OpenAI schema output with fallback inference logic

### 4) ChordVisualizer
- Input: unique chord list
- Output: reusable chord-card data (frets/fingers)
- Rendered using SVG diagrams (no static image dependency)

### 5) TheoryGuide
- Input: progressions + harmonic context
- Output: likely key, roman numerals, related chords, circle/modal context, explanation
- Uses uncertainty-friendly language and fallback inference if model unavailable

## Orchestration

The backend pipeline is coordinated in:

`SongSeeker -> TabTranslator -> StrumTranslator -> ChordVisualizer -> TheoryGuide`

The orchestrator handles:
- missing source text
- fallback parsers
- beginner simplification toggle
- warnings + uncertainty notes

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env.local
   ```
3. Add your OpenAI key in `.env.local`:
   ```bash
   OPENAI_API_KEY=your_key_here
   ```
4. Start local dev:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Testing

Run all tests:

```bash
npm test
```

Includes:
- parser utility tests
- agent output tests
- full mocked e2e orchestration flow

## What is Mocked vs Real

### Real
- End-to-end user flow and production-style architecture
- API route + orchestrator + all agent modules
- OpenAI Responses API integration paths for reasoning-heavy stages
- Structured schema outputs + validation when model is used

### Mocked/Fallback for MVP reliability
- Song source discovery provider uses mock source candidates
- Fallback parsing/theory/strumming behavior for environments without API keys
- Chord diagram library currently includes a core starter set + generic fallback shape

## Current MVP Limitations

- No live scraping/provider integrations yet (adapter scaffolding is ready)
- Simplify toggle currently updates interpretation layer and display-level choices
- Chord library is intentionally compact for MVP; can be expanded with voicing packs
- No persistence/user history yet

## Where to Integrate Live Tab Providers Next

Add adapters implementing `SongProvider` in:

- `lib/agents/songSeeker.ts`

Recommended next step:
- create `lib/agents/providers/ultimateGuitarProvider.ts`
- create `lib/agents/providers/songsterrProvider.ts`
- merge/rank with reliability scoring and deduplication

## Recommended Next Iterations

1. Add live provider adapters with legal-compliant ingestion.
2. Introduce explicit tool-calling and agent orchestration runtime.
3. Persist analyses and user practice plans.
4. Add section-level playback/metronome and practice loops.
5. Expand chord-shape engine for alternate voicings + capo-aware transposition.
