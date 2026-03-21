import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        'gallery-edit': resolve(__dirname, 'gallery-edit.html'),
        detail: resolve(__dirname, 'detail.html'),
      },
    },
  },
  server: {
    open: '/index.html'
  }
})
