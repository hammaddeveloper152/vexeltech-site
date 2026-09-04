/* Temporary: builds hero-preview.html as its own entry so the rebuild can be
   measured on a production bundle. Not part of the project config. */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-measure',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        preview: resolve(process.cwd(), 'hero-preview.html'),
      },
    },
  },
});
