// FILE: src/sw.js

import { precacheAndRoute } from 'workbox-precaching';
// ⚡ On importe la fonction de nettoyage depuis workbox-precaching
import { cleanupOutdatedCaches } from 'workbox-precaching';

// Nettoyer automatiquement les anciens caches des builds précédents
cleanupOutdatedCaches();

// Injection de la liste des fichiers à mettre en cache
precacheAndRoute(self.__WB_MANIFEST || []);

// Forcer le nouveau SW à s'activer dès que le bouton "Relancer" est cliqué
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Écouter l'événement Push envoyé par ton serveur backend
self.addEventListener('push', (event) => {
  let data = { title: 'EMENO', body: 'Nouvelle mise à jour disponible !' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'EMENO', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/favicon.ico', 
    vibrate: [200, 100, 200], // Vibration chic pour tes livreurs
    data: {
      url: data.url || '/' 
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Gérer le clic sur la notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});