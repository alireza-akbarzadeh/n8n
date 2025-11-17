import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/',
        'e2e/',
        'tests/',
        '.next/',
        'prisma/',
        'scripts/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types/**',
        'coverage/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: [
      { find: '@/features', replacement: path.resolve(__dirname, './src/features') },
      { find: '@/shared', replacement: path.resolve(__dirname, './src/shared') },
      { find: '@/core', replacement: path.resolve(__dirname, './src/core') },
      { find: '@/app', replacement: path.resolve(__dirname, './src/app') },
      { find: '@/components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@/lib', replacement: path.resolve(__dirname, './src/shared/infrastructure') },
      { find: '@/actions', replacement: path.resolve(__dirname, './src/core/auth') },
      { find: '@/config', replacement: path.resolve(__dirname, './src/core/config') },
      { find: '@/hooks', replacement: path.resolve(__dirname, './src/shared/ui/hooks') },
      { find: '@/inngest', replacement: path.resolve(__dirname, './src/inngest') },
      { find: '@/modules', replacement: path.resolve(__dirname, './src/features') },
      { find: '@/trpc', replacement: path.resolve(__dirname, './src/trpc') },
      { find: '@/types', replacement: path.resolve(__dirname, './src/core/types') },
      { find: '@/prisma', replacement: path.resolve(__dirname, './prisma') },
      { find: '@/src', replacement: path.resolve(__dirname, './src') },
      { find: '@/tests', replacement: path.resolve(__dirname, './tests') },
      { find: '@', replacement: path.resolve(__dirname, './') },
    ],
  },
});
