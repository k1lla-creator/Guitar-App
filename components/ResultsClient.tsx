'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/LoadingState';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import type { AnalysisResult, SongSeekerResult, SourceCandidate } from '@/lib/types/song';

function formatConfidence(score?: number): string {
  if (score === undefined) return '—';
  return `${Math.round(score * 100)}%`;
}

export function ResultsClient({ songTitle, artistName }: { songTitle: string; artistName: string }) {
  const [candidateResult, setCandidateResult] = useState<SongSeekerResult | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<SourceCandidate | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const canAutoAnalyze = useMemo(
    () => Boolean(candidateResult && !candidateResult.requiresConfirmation && candidateResult.chosen),
    [candidateResult]
  );

  useEffect(() => {
    async function loadCandidates() {
      setIsSearching(true);
      setError(null);
      try {
        const response = await fetch('/api/song-candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songTitle, artistName })
        });

        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.detail ?? 'Failed to search candidates.');
        }

        const payload = (await response.json()) as SongSeekerResult;
        setCandidateResult(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsSearching(false);
      }
    }

    void loadCandidates();
  }, [songTitle, artistName]);

  useEffect(() => {
    if (!canAutoAnalyze || !candidateResult?.chosen) return;
    if (selectedCandidate) return;
    setSelectedCandidate(candidateResult.chosen);
  }, [canAutoAnalyze, candidateResult, selectedCandidate]);

  useEffect(() => {
    async function runAnalysis() {
      if (!selectedCandidate) return;
      setIsAnalyzing(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songTitle, artistName, simplifyForBeginners: false, confirmedCandidate: selectedCandidate })
        });

        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.detail ?? 'Failed to analyze song.');
        }

        const payload = (await response.json()) as AnalysisResult;
        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsAnalyzing(false);
      }
    }

    void runAnalysis();
  }, [selectedCandidate, songTitle, artistName]);

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-lg border border-panelBorder/80 bg-black/20 px-3 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-white"
            aria-label="Back to home search"
          >
            <span aria-hidden="true">←</span>
            <span>Home</span>
          </button>
        </div>
        <div className="panel p-6 text-red-300">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 rounded-lg border border-panelBorder/80 bg-black/20 px-3 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-white"
          aria-label="Back to home search"
        >
          <span aria-hidden="true">←</span>
          <span>Home</span>
        </button>
      </div>

      <section className="panel space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Choose your song match</h2>
            <p className="text-sm text-muted">We ranked likely matches using typo-tolerant title + artist matching.</p>
          </div>
          {candidateResult?.requiresConfirmation ? (
            <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">Selection required</span>
          ) : (
            <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">Top match auto-selected</span>
          )}
        </div>

        {candidateResult?.ambiguityReason && (
          <p className="rounded-lg border border-panelBorder bg-black/20 px-3 py-2 text-xs text-muted">{candidateResult.ambiguityReason}</p>
        )}

        {isSearching && <LoadingState />}

        {!isSearching && candidateResult && (
          <div className="space-y-2">
            {candidateResult.candidates.map((candidate) => {
              const isActive = selectedCandidate?.url === candidate.url;
              return (
                <button
                  key={`${candidate.url}-${candidate.title}`}
                  type="button"
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isActive
                      ? 'border-accent bg-accent/10'
                      : 'border-panelBorder bg-black/20 hover:border-accent/40 hover:bg-black/30'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{candidate.songTitle ?? candidate.title}</p>
                      <p className="text-sm text-muted">{candidate.artist} • {candidate.sourceName}</p>
                      {candidate.versionLabel && <p className="text-xs text-muted">{candidate.versionLabel}</p>}
                      {candidate.matchReason && <p className="mt-2 text-xs text-muted">{candidate.matchReason}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">Confidence</p>
                      <p className="text-sm font-semibold text-accent">{formatConfidence(candidate.confidenceScore)}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!isSearching && !selectedCandidate && candidateResult?.requiresConfirmation && (
          <p className="text-sm text-muted">Please select a candidate above to continue into tab parsing.</p>
        )}
      </section>

      {isAnalyzing && <LoadingState />}
      {!isAnalyzing && data && <ResultsDashboard initial={data} />}
    </div>
  );
}
