import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Enable source maps for debugging
  build: {
    sourcemap: true,
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow access from other devices
    open: false, // Don't auto-open browser (let VS Code handle it)
    cors: true,
    hmr: {
      overlay: true, // Show error overlay
    },
  },
  
  // Enable source maps in development
  css: {
    devSourcemap: true,
  },
  
  // Optimize dependencies for better debugging
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  
  // Define global constants
  define: {
    __DEV__: JSON.stringify(true),
  },
  
  // Enable esbuild source maps
  esbuild: {
    sourcemap: true,
  },
})