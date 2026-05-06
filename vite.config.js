import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Cette option permet à Vite d'accepter les connexions via Ngrok
    allowedHosts: [
      'recoil-fence-company.ngrok-free.dev'
    ],
    // Optionnel : tu peux aussi utiliser 'all' si tu changes souvent d'URL Ngrok
    // allowedHosts: 'all' 
  }
})
