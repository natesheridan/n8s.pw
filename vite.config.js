import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), svgr()],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    },
  },
  define: {
    // Help React Three Fiber work with Preact
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    exclude: ['react', 'react-dom']
  },
  server: {
    host: true, // This allows the dev server to be accessible via local IP
  },
}) 