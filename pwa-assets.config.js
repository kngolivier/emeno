// FILE: pwa-assets.config.js
import { defineConfig, minimalPreset as preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  head: {
    inputs: [
      'public/logo-dark.png' // Ton fichier source d'origine
    ]
  },
  preset,
  images: [
    'public/logo-dark.png' // L'image qui servira à découper les icônes PWA
  ]
})