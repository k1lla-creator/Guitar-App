import { z } from 'zod';

export const sourceCandidateSchema = z.object({
  sourceName: z.string(),
  url: z.string(),
  title: z.string(),
  artist: z.string(),
  songTitle: z.string().optional(),
  versionLabel: z.string().optional(),
  confidenceScore: z.number().optional(),
  matchReason: z.string().optional(),
  artistMatchConfidence: z.number(),
  extractedText: z.string().optional()
});

export const analyzeRequestSchema = z.object({
  songTitle: z.string().min(1),
  artistName: z.string().min(1),
  simplifyForBeginners: z.boolean().optional().default(false),
  confirmedCandidate: sourceCandidateSchema.optional()
});

export const songCandidateSearchSchema = z.object({
  songTitle: z.string().min(1),
  artistName: z.string().min(1)
});
