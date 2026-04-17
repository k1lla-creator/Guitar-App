import { describe, expect, it } from 'vitest';
import { ChordVisualizerAgent } from '@/lib/agents/chordVisualizer';

describe('chord voicing recommendations', () => {
  it('returns multiple voicings and a recommended index', async () => {
    const agent = new ChordVisualizerAgent();
    const shapes = await agent.run(['G', 'C'], {
  it('returns multiple voicings and a recommended index', () => {
    const agent = new ChordVisualizerAgent();
    const shapes = agent.run(['G', 'C'], {
      sections: [{ section: 'Verse', progression: ['G', 'C', 'G', 'C'] }],
      simplifyForBeginners: false,
      songStyleHint: 'Warm, acoustic pop'
    });

    expect(shapes[0].voicings.length).toBeGreaterThan(1);
    expect(shapes[0].recommendedVoicingIndex).toBeGreaterThanOrEqual(0);
    expect(shapes[0].recommendationReason.length).toBeGreaterThan(0);
  });

  it('prefers easier/open voicings when simplify mode is on', async () => {
    const agent = new ChordVisualizerAgent();
    const [shape] = await agent.run(['F'], {
  it('prefers easier/open voicings when simplify mode is on', () => {
    const agent = new ChordVisualizerAgent();
    const [shape] = agent.run(['F'], {
      sections: [{ section: 'Chorus', progression: ['C', 'F', 'G', 'C'] }],
      simplifyForBeginners: true,
      songStyleHint: 'Warm ballad'
    });

    const recommended = shape.voicings[shape.recommendedVoicingIndex];
    expect(recommended.difficulty).toBe('easy');
    expect(recommended.neckPosition.toLowerCase()).toContain('open');
  });
});
