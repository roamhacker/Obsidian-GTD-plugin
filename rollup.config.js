//npm run build
//npm run dev

import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs';

const isProd = process.env.BUILD === 'production';
const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugin's github repository at
https://github.com/zsviczian/obsidian-stakeholder-actions
*/
`;

export default {
  input: './src/main.ts',
  output: {
    dir: 'dist',
    sourcemap: 'inline',
    //    sourcemapExcludeSources: isProd,
    format: 'cjs',
    exports: 'default',
    banner,
  },
  external: ['obsidian'],
  plugins: [
    copyAndWatch('src/styles.css', 'styles.css'),
    copyAndWatch('src/manifest.json', 'manifest.json'),
    nodeResolve({ browser: true }),
    typescript({ inlineSources: !isProd }),
    commonjs(),
  ],
};

function copyAndWatch(fileIn, fileOut, isProd) {
  return {
    name: 'copy-and-watch',
    async buildStart() {
      this.addWatchFile(fileIn);
    },
    async generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: fileOut,
        source: fs.readFileSync(fileIn),
      });
    },
  };
}
