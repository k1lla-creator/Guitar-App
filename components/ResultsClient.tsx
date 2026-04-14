'use client';

import { useEffect, useState } from 'react';
import { LoadingState } from '@/components/LoadingState';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import type { AnalysisResult } from '@/lib/types/song';

export function ResultsClient({ songTitle, artistName }: { songTitle: string; artistName: string }) {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (error) {
    return <div className="panel p-6 text-red-300">{error}</div>;
  }

  if (!data) {
    return <LoadingState />;
  }

  return <ResultsDashboard initial={data} />;
}
