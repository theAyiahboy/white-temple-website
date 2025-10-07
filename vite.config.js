import { defineConfig } from 'vite';

export default defineConfig({
  // Copy everything under ./assets to the build output as static files
  publicDir: 'assets',
  build: {
    outDir: 'dist',
  },
});
