#!/usr/bin/node
import * as esbuild from 'esbuild'

// this is usually called from ./packages/core
// so expect ./src to be the next folder
await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: true,
  outfile: './dist/bundle.js',
  sourcemap: true,
  tsconfig: 'tsconfig.json',
  external: ['react', 'react-dom'],
  banner: {
    js: '//comment',
    css: '/*comment*/',
  },
})
