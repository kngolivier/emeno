// FILE: vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Met à jour le Service Worker automatiquement
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.png'],
      manifest: {
        name: 'EMENO Delivery',
        short_name: 'EMENO',
        description: 'Service de livraison urbaine et gestion de commerces partenaires.',
        theme_color: '#1E293B',      // Teinte ardoise sombre EMENO
        background_color: '#0F172A', // Arrière-plan sombre EMENO
        display: 'standalone',       // Supprime la barre d'adresse du navigateur pour l'effet "App Native"
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Indispensable pour éviter que l'icône soit tronquée sous Android
          }
        ]
      },
      workbox: {
        // Stratégie de mise en cache locale pour le fonctionnement hors-ligne (Offline support)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Mise en cache ultra-rapide des images Cloudinary (logos des commerces, avatars...)
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'emeno-cloudinary-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Garder en cache pendant 30 jours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache pour les Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'emeno-google-fonts'
            }
          }
        ]
      }
    })
  ],
  server: {
    // 'all' permet à Vite d'accepter ton URL Ngrok actuelle ou toute nouvelle URL sans bloquer
    allowedHosts: 'all'
  },
  // Configuration pour le mode de prévisualisation de production (npm run preview)
  preview: {
    allowedHosts: 'all',
    host: true,         // Écoute sur toutes les interfaces locales (0.0.0.0) pour Ngrok
    strictPort: false    // Évite les conflits si le port 4173 est temporairement bloqué
  }
})