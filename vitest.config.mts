import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Vite/Rollup's alias matcher only special-cases a trailing-slash `find` (so
// scoped packages like `@testing-library/*` aren't rewritten) when both the
// find and replacement end in `/`; on Windows fileURLToPath() ends in `\`, so
// normalize separators here to keep that matching intact cross-platform.
const root = fileURLToPath(new URL('.', import.meta.url)).replace(/\\/g, '/');

export default defineConfig({
  resolve: {
    alias: { '@/': root },
  },
  test: {
    include: ['lib/**/*.test.ts'],
    environment: 'node',
  },
});
