// public/sw.js
self.addEventListener('install', function (event) {
  console.log('SW Installed');
});

self.addEventListener('activate', function (event) {
  console.log('SW Activated');
});

// Push notification listener
self.addEventListener('push', function (event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'ElderSaath Alert', body: event.data.text() };
    }
  }

  const title = data.title || 'ElderSaath Alert';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// DO NOT aggressively cache private API routes
self.addEventListener('fetch', function(event) {
  // Simple pass-through for now to avoid caching sensitive health/medical data
  // which is a strictly enforced security requirement.
  event.respondWith(fetch(event.request));
});
