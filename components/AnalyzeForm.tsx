'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AnalyzeForm() {
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const params = new URLSearchParams({ songTitle, artistName });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="panel mx-auto w-full max-w-xl space-y-5 p-8">
      <div className="space-y-1">
        <label className="text-sm text-muted">Song title</label>
        <input
          required
          value={songTitle}
          onChange={(event) => setSongTitle(event.target.value)}
          className="w-full rounded-xl border border-panelBorder bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
          placeholder="Wonderwall"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-muted">Artist name</label>
        <input
          required
          value={artistName}
          onChange={(event) => setArtistName(event.target.value)}
          className="w-full rounded-xl border border-panelBorder bg-black/20 px-4 py-3 outline-none transition focus:border-accent"
          placeholder="Oasis"
        />
      </div>
      <button
        disabled={loading}
        className="w-full rounded-xl bg-accent px-5 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? 'Analyzing…' : 'Analyze Song'}
      </button>
    </form>
  );
}
