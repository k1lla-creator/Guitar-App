import { z } from 'zod';

export const analyzeRequestSchema = z.object({
  songTitle: z.string().min(1),
  artistName: z.string().min(1),
  simplifyForBeginners: z.boolean().optional().default(false)
});
