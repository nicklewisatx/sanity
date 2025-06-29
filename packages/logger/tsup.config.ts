import { defineConfig } from 'tsup';

export default defineConfig([
  // Node.js build
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['winston', 'winston-daily-rotate-file'],
    platform: 'node',
    target: 'node18',
  },
  // Edge Runtime build
  {
    entry: {
      edge: 'src/edge.ts',
    },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false, // Don't clean since we have multiple builds
    platform: 'neutral',
    target: 'es2022',
  },
]);