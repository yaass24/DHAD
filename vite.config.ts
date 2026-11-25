import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages serves this project from  https://yaass24.github.io/DHAD/
 * so the production build needs the base path "/DHAD/".
 *
 * Hosting it somewhere else (another repo name, a custom domain, Netlify, a
 * subfolder) only needs a different base — set DHAD_BASE when building:
 *   DHAD_BASE=/ npm run build        → site root
 *   DHAD_BASE=./ npm run build       → any folder / opened from disk
 */
const base = process.env.DHAD_BASE ?? '/DHAD/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
