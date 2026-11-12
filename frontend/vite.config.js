
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true
      }
    }
  },

  build: {
    outDir: path.resolve(
      import.meta.dirname,
      '../backend/src/main/resources/static'
    ),
    emptyOutDir: true
  }
})
