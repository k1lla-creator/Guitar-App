'use client';

import { useMemo, useState } from 'react';
import type { ChordShape } from '@/lib/types/song';

export function ChordDiagram({ shape }: { shape: ChordShape }) {
  const [voicingIndex, setVoicingIndex] = useState(shape.recommendedVoicingIndex);
  const voicing = shape.voicings[voicingIndex];
  const width = 140;
  const height = 190;
  const top = 30;

  const displayBaseFret = useMemo(() => {
    if (voicing.baseFret) return voicing.baseFret;
    const fretted = voicing.frets.filter((fret) => typeof fret === 'number' && fret > 0) as number[];
    if (!fretted.length) return 1;
    const minFret = Math.min(...fretted);
    return minFret > 4 ? minFret : 1;
  }, [voicing.baseFret, voicing.frets]);

  const isRecommended = voicingIndex === shape.recommendedVoicingIndex;

  return (
    <div className="panel space-y-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-lg font-semibold">{shape.chord}</h4>
          <p className="text-xs text-muted">{voicing.label}</p>
        </div>
        {isRecommended && (
          <span className="rounded-full border border-accent/60 bg-accent/15 px-2 py-0.5 text-[11px] text-accent">
            Recommended
          </span>
        )}
      </div>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${shape.chord} chord diagram`}>
        {[0, 1, 2, 3, 4].map((fret) => (
          <line key={`fret-${fret}`} x1={20} x2={120} y1={top + fret * 25} y2={top + fret * 25} stroke="#6b7280" strokeWidth={fret === 0 && displayBaseFret === 1 ? 3 : 1} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((string) => (
          <line key={`string-${string}`} x1={20 + string * 20} x2={20 + string * 20} y1={top} y2={top + 100} stroke="#6b7280" strokeWidth={1} />
        ))}

        {displayBaseFret > 1 && (
          <text x={6} y={top + 18} fill="#9ca3af" fontSize={11}>{displayBaseFret}fr</text>
        )}

        {voicing.frets.map((fret, i) => {
          if (typeof fret !== 'number' || fret === 0) return null;
          const relativeFret = displayBaseFret > 1 ? fret - displayBaseFret + 1 : fret;
          if (relativeFret < 1 || relativeFret > 4) return null;
          const cx = 20 + i * 20;
          const cy = top + relativeFret * 25 - 12;
          return <circle key={`dot-${i}`} cx={cx} cy={cy} r={6} fill="#a78bfa" />;
        })}

        {voicing.frets.map((fret, i) => {
          const x = 20 + i * 20;
          if (fret === 'x') return <text key={`x-${i}`} x={x - 4} y={16} fill="#9ca3af">x</text>;
          if (fret === 0 && displayBaseFret === 1) return <text key={`o-${i}`} x={x - 4} y={16} fill="#9ca3af">o</text>;
          return null;
        })}
      </svg>

      <div className="flex items-center justify-between text-xs text-muted">
        <button
          type="button"
          className="rounded-lg border border-panelBorder px-2 py-1 hover:border-accent/50 hover:text-white"
          onClick={() => setVoicingIndex((value) => (value - 1 + shape.voicings.length) % shape.voicings.length)}
        >
          Prev
        </button>
        <span>{voicingIndex + 1} / {shape.voicings.length}</span>
        <button
          type="button"
          className="rounded-lg border border-panelBorder px-2 py-1 hover:border-accent/50 hover:text-white"
          onClick={() => setVoicingIndex((value) => (value + 1) % shape.voicings.length)}
        >
          Next
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted">
        <p>Difficulty: <span className="text-slate-200">{voicing.difficulty}</span></p>
        <p>Position: <span className="text-slate-200">{voicing.neckPosition}</span></p>
      </div>

      {shape.recommendationReason && (
        <p className="rounded-lg border border-panelBorder/80 bg-black/20 px-3 py-2 text-xs text-muted">
          {shape.recommendationReason}
        </p>
      )}
    </div>
  );
}
