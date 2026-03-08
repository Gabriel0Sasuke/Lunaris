import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    devOptions: {
      enabled: true
    },
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Lunaris',
        short_name: 'Lunaris',
        description: 'Um leitor de mangás desenvolvido de fã para fã, focado no compartilhamento de histórias e cultura.',
        theme_color: '#000000', // Você pode trocar pela cor principal do seu CSS 🎨
        icons: [
          // Ícone para dispositivos de alta resolução (192x192)
          {
            src: '/icon/favicon_small.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          // Ícone para dispositivos de alta resolução (512x512)
          {
            src: '/icon/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
  })],
  server: {
    allowedHosts: true,
  },
})
