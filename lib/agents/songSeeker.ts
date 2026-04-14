import { mockKey } from '@/lib/mock/songMocks';
import type { SongSeekerResult } from '@/lib/types/song';

export interface SongProvider {
  search(songTitle: string, artistName: string): Promise<SongSeekerResult>;
}

export class MockSongProvider implements SongProvider {
  async search(songTitle: string, artistName: string): Promise<SongSeekerResult> {
    const result = mockKey(songTitle, artistName);
    return {
      candidates: result.candidates,
      chosen: result.candidates[0],
      notes:
        'Using mock provider data. Replace with live adapters for Ultimate Guitar, Songsterr, etc.'
    };
  }
}

export class SongSeekerAgent {
  constructor(private readonly provider: SongProvider = new MockSongProvider()) {}

  async run(songTitle: string, artistName: string): Promise<SongSeekerResult> {
    return this.provider.search(songTitle, artistName);
  }
}
