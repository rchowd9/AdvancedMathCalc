import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { LEGACY_SCRIPTS } from './src/legacyScripts.js';


function copyLegacyAssets() {
  return {
    name: 'copy-legacy-assets',
    closeBundle() {
      const outputDirectory = path.resolve('dist');
      for (const asset of LEGACY_SCRIPTS) {
        fs.copyFileSync(path.resolve(asset), path.join(outputDirectory, asset));
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyLegacyAssets()],
  base: './',
  test: {
    environment: 'node',
  },
});
