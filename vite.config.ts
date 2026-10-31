import { defineConfig } from 'vite';

// base './' keeps every asset path relative, so dist/ works from any static host or sub-path.
export default defineConfig({
  base: './',
  build: { outDir: 'dist', assetsInlineLimit: 0, chunkSizeWarningLimit: 2000 },
  server: { host: true },
});
