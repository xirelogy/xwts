import { defineConfig } from 'vite';

import xwtsI18n from '@xirelogy/rollup-plugin-xwts-i18n';

const i18n = xwtsI18n({
  output: {
    type: 'file',
    fileName: 'locales.es.js',
    cjsFileName: 'locales.umd.js',
    dtsFilename: 'locales.d.ts',
  },
  roots: {
    'locales': [ 'xwts' ],
  },
  include: 'locales/**'
});

export default defineConfig({
  plugins: [
    i18n,
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Xwts',
    },
    sourcemap: true,
  },
});