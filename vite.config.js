import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
          ecosystem: ['vue-router', 'pinia'],
          components: ['vue-select'],
          firebase: ['firebase/app'],
          firestore: ['firebase/firestore/lite'],
          auth: ['firebase/auth'],
          stores: ['./src/stores/menus', './src/stores/users']
        },
      },
    },
  },
})
