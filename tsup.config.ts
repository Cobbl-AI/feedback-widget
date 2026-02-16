import { defineConfig } from 'tsup'

export default defineConfig([
  // Main vanilla JS exports (ESM and CJS)
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: true,
    external: [],
    esbuildOptions(options) {
      options.jsx = 'automatic'
      options.jsxImportSource = 'preact'
    },
  },
  // React component (ESM and CJS) - keeps React as external
  {
    entry: { react: 'src/react.tsx' },
    format: ['cjs', 'esm'],
    dts: false, // Skip DTS, we'll create it manually
    splitting: false,
    sourcemap: true,
    minify: true,
    external: ['react'],
    banner: {
      js: "'use client';",
    },
    esbuildOptions(options) {
      options.jsx = 'automatic'
      options.jsxImportSource = 'preact'
    },
  },
  // IIFE build for script tag / CDN (auto-mounts with MutationObserver)
  {
    entry: { 'cobbl-feedback-widget': 'src/browser.ts' },
    format: ['iife'],
    splitting: false,
    sourcemap: true,
    minify: true,
    external: [],
    esbuildOptions(options) {
      options.jsx = 'automatic'
      options.jsxImportSource = 'preact'
    },
  },
])
