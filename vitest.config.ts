import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Configure test environment, globals, etc.
    globals: true, // Makes Vitest APIs like `test`, `expect`, `vi` global
    environment: 'node', // Use 'node' environment for backend tests
    include: ['src/**/*.test.{ts,js}'], // Pattern to find test files
    exclude: ['node_modules', 'dist'],
    // Add typechecking if needed
    typecheck: {
      include: ['src/**/*.test-d.{ts,js}'],
      tsconfig: 'tsconfig.json',
    },
  },
});