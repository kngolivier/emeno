// FILE: vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      // 💡 On passe en mode 'prompt' pour notifier l'utilisateur plutôt que de recharger brutalement
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'], // Fichiers mis en cache pour le mode offline
        cleanupOutdatedCaches: true,
        // 🔥 Permet au bouton "Relancer" d'activer immédiatement le nouveau SW dès que l'utilisateur clique
        skipWaiting: false,
        clientsClaim: true
      },
      manifest: {
        name: 'EMENO Delivery',
        short_name: 'EMENO',
        description: 'Service de livraison urbaine et gestion de commerces partenaires.',
        theme_color: '#1E293B',
        background_color: '#0F172A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ],
  server: { allowedHosts: 'all' },
  preview: { allowedHosts: 'all', host: true, strictPort: false }
})