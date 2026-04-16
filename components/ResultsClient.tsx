'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/LoadingState';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import type { AnalysisResult } from '@/lib/types/song';

export function ResultsClient({ songTitle, artistName }: { songTitle: string; artistName: string }) {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function run() {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songTitle, artistName, simplifyForBeginners: false })
        });
        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.detail ?? 'Failed to analyze song.');
        }
        const payload = (await response.json()) as AnalysisResult;
        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    void run();
  }, [songTitle, artistName]);

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

      {error && <div className="panel p-6 text-red-300">{error}</div>}
      {!error && !data && <LoadingState />}
      {data && <ResultsDashboard initial={data} />}
    </div>
  );
}
