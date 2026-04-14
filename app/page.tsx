import { AnalyzeForm } from '@/components/AnalyzeForm';

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-muted">SongSeeker AI</p>
          <h1 className="text-4xl font-bold md:text-6xl">Find it. Understand it. Play it.</h1>
          <p className="mx-auto max-w-2xl text-muted">
            One calm assistant for tab discovery, chord extraction, strumming guidance, chord visuals, and beginner-friendly theory.
          </p>
        </div>
        <AnalyzeForm />
      </div>
    </main>
  );
}
