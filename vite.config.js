import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base: './',
  // 4003/interactivetool/ep/
  base: '/interactivetool/ep/',
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['dl.tail9c350.ts.net','100.67.47.42'],
  },
  proxy: {
    '/api': {
      target: 'http://localhost:4003', // 👈 your backend API inside the container
      changeOrigin: true,
      secure: false,
    }
  },
  build: {
    // outDir: 'dist',
    // assetsDir: 'assets',
    // Handle asset file names
    rollupOptions: {
      output: {
        assetFileNames: '[name].[hash][extname]',
        chunkFileNames: '[name].[hash].js',
        entryFileNames: '[name].[hash].js',
      }
    }
  }
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 4173,
//   },
//   base: './',
//   build: {
//     rollupOptions: {
//       output: {
//         assetFileNames: 'assets/[name].[hash][extname]',
//         chunkFileNames: 'assets/[name].[hash].js',
//         entryFileNames: 'assets/[name].[hash].js',
//       }
//     }
//   },
// })
