import { NextResponse } from 'next/server';
import { analyzeRequestSchema } from '@/lib/types/api';
import { analyzeSong } from '@/lib/orchestrator/analyzeSong';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = analyzeRequestSchema.parse(body);
    const result = await analyzeSong(parsed);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unable to analyze song.',
        detail: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
