"use strict";var precacheConfig=[["/index.html","ee3b5102d6af05900861753a3faa612e"],["/static/css/main.f65460b7.css","f4de823c57e85bc7f809d97e6527b8aa"],["/static/js/main.71160890.js","3a8fa2115c24d54ce159a2381cd41312"],["/static/media/UploadIcon.1cedb6e9.svg","1cedb6e919bfed6a2c1ec00b5d8ee620"],["/static/media/body-bg.e9644cec.jpg","e9644cec0bee1ff87bb5a033c2d60389"],["/static/media/findYourGym.e8b07b13.jpg","e8b07b13ab2b7af614eb939faa199ce7"],["/static/media/fontello.2c77af51.svg","2c77af5133865b8611d90c3a81fa8ebc"],["/static/media/fontello.89d04078.eot","89d040784f833c07af20740dfea15ec0"],["/static/media/fontello.92d85a2c.ttf","92d85a2c3c83281a0bdee18a2f2b54d8"],["/static/media/fontello.c6dad888.woff2","c6dad888190e0d332ff98426bd37368d"],["/static/media/fontello.f971adaa.woff","f971adaac65ed228d2b70f18c788b2bf"],["/static/media/forumWallpaper.03ae5629.jpg","03ae562939b6a1eb85dcffb955cd92ec"],["/static/media/gymForum.7d7b965a.jpg","7d7b965aba75d04afad4d789e2eba352"],["/static/media/personalTrainer.ff1ae2ee.jpg","ff1ae2ee865fcfa919de6adfc6495a8f"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,a,n){var r=new URL(e);return n&&r.pathname.match(n)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return a.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),r=createCacheKey(n,hashParamName,a,/\.\w{8}\./);return[n.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!a.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,a=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,n),e=urlsToCacheKeys.has(a));var r="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(a=new URL(r,self.location).toString(),e=urlsToCacheKeys.has(a)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});