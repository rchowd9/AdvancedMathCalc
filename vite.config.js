import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const legacyAssets = [
  'wordProblems.js',
  'proof.js',
  'geometryProofs.js',
  'chemistry.js',
  'physics.js',
  'engineering.js',
  'script.js'
];

function copyLegacyAssets() {
  return {
    name: 'copy-legacy-assets',
    closeBundle() {
      const outputDirectory = path.resolve('dist');
      for (const asset of legacyAssets) {
        fs.copyFileSync(path.resolve(asset), path.join(outputDirectory, asset));
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyLegacyAssets()],
  base: process.env.GITHUB_ACTIONS ? '/AdvancedMathCalc/' : '/',
  test: {
    environment: 'node',
  },
});
