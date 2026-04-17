import { NextResponse } from 'next/server';
import { SongSeekerAgent } from '@/lib/agents/songSeeker';
import { songCandidateSearchSchema } from '@/lib/types/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = songCandidateSearchSchema.parse(body);

    const seeker = new SongSeekerAgent();
    const result = await seeker.run(parsed.songTitle, parsed.artistName);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unable to search song candidates.',
        detail: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
