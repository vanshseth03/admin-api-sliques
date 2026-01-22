/* Service Worker for Push Notifications */

const CACHE_NAME = 'sliques-admin-v3';
const urlsToCache = [
  '/',
  '/index.html'
];

// Check if we're in development
const isDev = self.location.hostname === 'localhost';

// Install - skip caching in dev mode
self.addEventListener('install', (event) => {
  if (isDev) {
    self.skipWaiting();
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(() => {})
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - Don't intercept in development
self.addEventListener('fetch', (event) => {
  // CRITICAL: Don't intercept ANY requests in development
  if (isDev) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Network first, then cache strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            return cachedResponse || new Response('Offline', { 
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Push Notification
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  let data = {
    title: 'SLIQUES',
    body: 'New notification',
    icon: '/favicon.png',
    badge: '/favicon.png'
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/favicon.png',
    badge: data.badge || '/favicon.png',
    vibrate: [200, 100, 200],
    tag: 'sliques-order',
    renotify: true,
    requireInteraction: true,
    data: data.data || {},
    actions: [
      { action: 'view', title: 'View Order' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') return;
  
  const orderId = event.notification.data?.orderId;
  const url = orderId ? `/?order=${orderId}` : '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.postMessage({ type: 'NOTIFICATION_CLICK', orderId });
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
