import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The app imports the repo's shared token CSS (../shared), so the dev server may read one level up.
// `vite build` writes dist/eb-app/; tools/inline-app.py then folds it into one file, dist/eb-app.html,
// that opens straight from disk or inside a sandboxed preview.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 4190, strictPort: true, fs: { allow: ['..'] } },
  build: {
    outDir: '../dist/eb-app',
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000, // every icon/image becomes a data URI, so the single-file build has no loose assets
    cssCodeSplit: false,
  },
})
