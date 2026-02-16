import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'dev', // Set dev folder as root
  resolve: {
    alias: {
      // Map package imports to source files during development
      '@cobbl-ai/feedback-widget': path.resolve(__dirname, './src/index.ts'),
      '@cobbl-ai/feedback-widget/react': path.resolve(
        __dirname,
        './src/react.tsx'
      ),
    },
  },
  css: {
    postcss: path.resolve(__dirname, './postcss.config.js'),
  },
  server: {
    port: 3002,
    open: false,
  },
  optimizeDeps: {
    include: ['preact', 'react', 'react-dom'],
  },
})
