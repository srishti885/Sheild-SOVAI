import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. SABSE ZARURI: Isse blank screen fix hogi (Relative Paths)
  base: './', 

  server: {
    host: true, // Network access on karega
    port: 5173,
    proxy: {
      // 2. Node.js Backend Proxy (Express/Auth)
      '/api': {
        target: 'https://shield-sovai-backend.onrender.com', // Apna asli Node URL dalein
        changeOrigin: true,
        secure: true,
      },
      // 3. AI Engine Proxy (Python/FastAPI)
      '/ai': {
        target: 'https://shield-sovai-ai.onrender.com', // Apna asli AI URL dalein
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ai/, '') // Agar AI backend pe prefix nahi hai
      }
    }
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Chunking taaki file size badi na ho
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})