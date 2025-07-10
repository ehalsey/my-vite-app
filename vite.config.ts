import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include .tsx files
      include: "**/*.{jsx,tsx}",
    })
  ],
  
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow access from other devices
    open: false, // Don't auto-open browser (let VS Code handle it)
    cors: true,
    hmr: {
      overlay: true, // Show error overlay
      port: 5173,
    },
    watch: {
      // Watch for file changes
      usePolling: true,
      interval: 100,
    },
  },
  
  // Enable source maps for debugging
  build: {
    sourcemap: true,
  },
  
  // Enable source maps in development
  css: {
    devSourcemap: true,
  },
  
  // Optimize dependencies for better debugging and hot reload
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true, // Force dependency pre-bundling
  },
  
  // Enable esbuild source maps
  esbuild: {
    sourcemap: true,
  },
  
  // Clear screen on reload
  clearScreen: false,
})