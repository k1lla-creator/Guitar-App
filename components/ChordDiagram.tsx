import type { ChordShape } from '@/lib/types/song';

export function ChordDiagram({ shape }: { shape: ChordShape }) {
  const width = 140;
  const height = 170;
  const top = 26;

  return (
    <div className="panel p-4">
      <h4 className="mb-3 text-lg font-semibold">{shape.chord}</h4>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${shape.chord} chord diagram`}>
        {[0, 1, 2, 3, 4].map((fret) => (
          <line key={`fret-${fret}`} x1={20} x2={120} y1={top + fret * 25} y2={top + fret * 25} stroke="#6b7280" strokeWidth={fret === 0 ? 3 : 1} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((string) => (
          <line key={`string-${string}`} x1={20 + string * 20} x2={20 + string * 20} y1={top} y2={top + 100} stroke="#6b7280" strokeWidth={1} />
        ))}
        {shape.frets.map((fret, i) => {
          if (typeof fret !== 'number' || fret === 0) return null;
          const cx = 20 + i * 20;
          const cy = top + fret * 25 - 12;
          return <circle key={`dot-${i}`} cx={cx} cy={cy} r={6} fill="#a78bfa" />;
        })}
        {shape.frets.map((fret, i) => {
          const x = 20 + i * 20;
          if (fret === 'x') return <text key={`x-${i}`} x={x - 4} y={14} fill="#9ca3af">x</text>;
          if (fret === 0) return <text key={`o-${i}`} x={x - 4} y={14} fill="#9ca3af">o</text>;
          return null;
        })}
      </svg>
    </div>
  );
}
