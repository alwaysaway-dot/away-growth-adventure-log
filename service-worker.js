const cacheName = "awei-growth-cache-v1";

const coreAssets = [
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./assets/characters/stage-01-balanced.png",
  "./assets/characters/stage-02-balanced.png",
  "./assets/characters/stage-03-balanced.png",
  "./assets/characters/stage-04-balanced.png",
  "./assets/characters/stage-05-balanced.png",
  "./assets/characters/stage-06-balanced.png",
  "./assets/characters/stage-07-balanced.png",
  "./assets/characters/stage-08-balanced.png",
  "./assets/characters/stage-09-balanced.png",
  "./assets/characters/stage-10-balanced.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

// 安装时缓存核心静态文件，让页面具备基础离线打开能力。
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(coreAssets);
    })
  );
});

// 激活时删除旧缓存。以后更新资源时，只需要修改 cacheName 版本号。
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== cacheName;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
});

// 读取资源时优先使用缓存，缓存没有再请求网络。
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      return cachedResponse || fetch(event.request);
    })
  );
});
