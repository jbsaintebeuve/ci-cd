import {defineConfig} from 'vitest/config'


export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/main.tsx',
        'src/components/ui/**',
        'dist/**',
        'docs/**',
        'public/docs/**',
        'cypress/**',
        'src/router.tsx',
        'src/test-utils.tsx',
        'module.ts',
        '*.config.*',
        '*.cjs',
      ],
    },
    setupFiles: ['./vitest-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})