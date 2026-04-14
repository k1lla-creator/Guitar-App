import { ResultsClient } from '@/components/ResultsClient';

export default async function ResultsPage({ searchParams }: { searchParams: Promise<{ songTitle?: string; artistName?: string }> }) {
  const params = await searchParams;
  if (!params.songTitle || !params.artistName) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <div className="panel p-6 text-muted">Please provide a song title and artist from the homepage.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <ResultsClient songTitle={params.songTitle} artistName={params.artistName} />
    </main>
  );
}
