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
          vendor: ['vue', 'vue-router', 'pinia', 'vue-select'],
          firebase: ['firebase/app', 'firebase/firestore'],
          auth: ['firebase/auth'],
          stores: ['./src/stores/menus', './src/stores/users']
        },
      },
    },
  },
})
