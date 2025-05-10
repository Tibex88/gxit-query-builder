import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import path from "path"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({ 
  plugins: [
    react(),
    viteSingleFile(),
    tailwindcss()
],
  base: '/interactivetool/ep/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
})
