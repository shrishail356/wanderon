import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    // Backend API URL - never exposed to client
    BACKEND_API_URL: z.string().url().optional(),
  },

  client: {
    // Public API URL (for direct calls if needed, but we'll use proxy)
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },

  runtimeEnv: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  /**
   * - *extra safety* so no server var accidentally leaks to the client:
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION && process.env.SKIP_ENV_VALIDATION !== 'false',
});

