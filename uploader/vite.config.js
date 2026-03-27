import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para contornar CORS das imagens do AniList
      '/anilist-cdn': {
        target: 'https://s4.anilist.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/anilist-cdn/, ''),
      }
    }
  }
})
