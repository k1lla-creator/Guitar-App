'use client';

import { useMemo, useState } from 'react';
import type { AnalysisResult } from '@/lib/types/song';
import { ChordDiagram } from '@/components/ChordDiagram';

type TabKey = 'chords' | 'strumming' | 'shapes' | 'theory';

export function ResultsDashboard({ initial }: { initial: AnalysisResult }) {
  const [tab, setTab] = useState<TabKey>('chords');
  const [simplify, setSimplify] = useState(initial.simplifyForBeginners);
  const active = useMemo(() => ({ ...initial, simplifyForBeginners: simplify }), [initial, simplify]);

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'chords', label: 'Chords' },
    { key: 'strumming', label: 'Strumming' },
    { key: 'shapes', label: 'Chord Shapes' },
    { key: 'theory', label: 'Theory' }
  ];

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{active.songTitle}</h2>
            <p className="text-muted">{active.artistName}</p>
            <p className="mt-3 text-sm text-muted">Source: {active.source.sourceName}</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-muted">Likely key</p>
            <p className="font-medium">{active.theory.likelyKey}</p>
            <p className="mt-3 text-muted">Mood</p>
            <p className="max-w-xs">{active.theory.harmonicFeel}</p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <div className="panel inline-flex p-1">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`rounded-xl px-4 py-2 text-sm transition ${tab === item.key ? 'bg-accent text-black' : 'text-muted hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          className={`rounded-xl border px-4 py-2 text-sm ${simplify ? 'border-accent text-accent' : 'border-panelBorder text-muted'}`}
          onClick={() => setSimplify((v) => !v)}
        >
          Simplify for Beginners: {simplify ? 'On' : 'Off'}
        </button>
      </div>

      <section className="panel p-6">
        {tab === 'chords' && (
          <div className="space-y-4">
            {active.tab.sections.map((section) => (
              <div key={section.section}>
                <h3 className="text-lg font-semibold">{section.section}</h3>
                <p className="mt-2 text-muted">{section.progression.join('  •  ')}</p>
                {section.repeatedFrom && <p className="text-sm text-muted">Repeated from {section.repeatedFrom}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'strumming' && (
          <div className="space-y-4">
            <p><span className="text-muted">Recommended:</span> {active.strumming.recommendedPattern}</p>
            <p><span className="text-muted">Easier:</span> {active.strumming.easierPattern}</p>
            <p><span className="text-muted">Feel:</span> {active.strumming.feelTempo}</p>
            <p className="text-sm text-muted">{active.strumming.confidenceNote}</p>
          </div>
        )}

        {tab === 'shapes' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.chordShapes.map((shape) => <ChordDiagram key={shape.chord} shape={shape} />)}
          </div>
        )}

        {tab === 'theory' && (
          <div className="space-y-3">
            <p><span className="text-muted">Key:</span> {active.theory.likelyKey}</p>
            <p><span className="text-muted">Roman numerals:</span> {active.theory.romanNumerals.join(' • ')}</p>
            <p><span className="text-muted">Related diatonic chords:</span> {active.theory.relatedDiatonicChords.join(', ')}</p>
            <p><span className="text-muted">Circle of fifths:</span> {active.theory.circleOfFifthsContext}</p>
            <p><span className="text-muted">Modal color:</span> {active.theory.modalColor}</p>
            <p><span className="text-muted">Why these chords work:</span> {active.theory.whyItWorks}</p>
            <p className="text-sm text-muted">{active.theory.uncertaintyNote}</p>
          </div>
        )}
      </section>
    </div>
  );
}
