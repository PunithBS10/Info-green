import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['echarts']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://raw.githubusercontent.com',
        changeOrigin: true,
        rewrite: (path) => {
          // Proxy API calls to external data sources for static hosting
          if (path === '/api/renewable-data') {
            return '/owid/owid-datasets/master/datasets/Share%20of%20electricity%20production%20from%20renewables%20%E2%80%93%20Energy%20Institute/Share%20of%20electricity%20production%20from%20renewables%20%E2%80%93%20Energy%20Institute.csv'
          }
          return path
        }
      }
    }
  }
})