// FILE: src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import VConsole from 'vconsole';

// // On l'active uniquement en mode développement pour ne pas polluer la production
// if (import.meta.env.DEV) {
//   new VConsole();
// }

// Enregistrement du Service Worker pour la PWA EMENO
import { registerSW } from 'virtual:pwa-register';
registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)