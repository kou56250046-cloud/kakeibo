/* =============================================
   家計フロー・ナビ — Service Worker v1
   ============================================= */
const CACHE_NAME = 'kakeibo-v1';

// キャッシュするアプリシェル（Firestore / Firebase は対象外）
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ─── インストール：アプリシェルをキャッシュ ───
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// ─── アクティベート：古いキャッシュを削除 ───
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ─── フェッチ：キャッシュ優先（Firebase関連は除外） ───
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Firebase / Google API はキャッシュしない（常にネットワーク）
  if (
    url.includes('firestore.googleapis.com') ||
    url.includes('firebase') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(
      (cached) => cached || fetch(event.request)
    )
  );
});
