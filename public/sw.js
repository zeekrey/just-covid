if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let a=Promise.resolve();return n[e]||(a=new Promise(async a=>{if("document"in self){const n=document.createElement("script");n.src=e,document.head.appendChild(n),n.onload=a}else importScripts(e),a()})),a.then(()=>{if(!n[e])throw new Error(`Module ${e} didn’t register its module`);return n[e]})},a=(a,n)=>{Promise.all(a.map(e)).then(e=>n(1===e.length?e[0]:e))},n={require:Promise.resolve(a)};self.define=(a,s,i)=>{n[a]||(n[a]=Promise.resolve().then(()=>{let n={};const r={uri:location.origin+a.slice(1)};return Promise.all(s.map(a=>{switch(a){case"exports":return n;case"module":return r;default:return e(a)}})).then(e=>{const a=i(...e);return n.default||(n.default=a),n})}))}}define("./sw.js",["./workbox-c2b5e142"],(function(e){"use strict";importScripts(),e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/_Ok5a3kkDLmlyfiUlU5W0/_buildManifest.js",revision:"738bbcee2029cc398b3b5c5d8c73872c"},{url:"/_next/static/_Ok5a3kkDLmlyfiUlU5W0/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"/_next/static/chunks/6b758063d7b79e4d1202dd23e4469e6156ef17f9.4d59314d65571b31cff8.js",revision:"71ef2037587c857b0c0d6c45fd1fdf1f"},{url:"/_next/static/chunks/b17af4837cc0e9fb3316e8b8e3f986b01ef17bda.2e5e8f87c44f1d50918a.js",revision:"fe1fa0f5be3a4145bd098a8e750bad26"},{url:"/_next/static/chunks/commons.d10931fb8ce3d5a36e3b.js",revision:"3554ad7b9120e893828e2dc182477e43"},{url:"/_next/static/chunks/framework.fcef98db13e2318579fb.js",revision:"493773db7ca4f531e862834fccf9d157"},{url:"/_next/static/chunks/main-7d7db2b321ad1d70f894.js",revision:"60337a84b018288c0abb963e65e78aa3"},{url:"/_next/static/chunks/pages/%5Bcity%5D-00e67fbe38e96f38f4b0.js",revision:"c9134cf12c11670b3c794e9c57fef2aa"},{url:"/_next/static/chunks/pages/_app-f6aa8da61d7dd0642f2f.js",revision:"ad3625f823a9b209941625cb0d070ca4"},{url:"/_next/static/chunks/pages/_error-4a138d52c6f6292db95f.js",revision:"8f4494379a0b9a02caf8aa4d22c98737"},{url:"/_next/static/chunks/pages/index-639e287d06a227c4b79d.js",revision:"f596d8a1199937149c2dba3deebec3dc"},{url:"/_next/static/chunks/polyfills-a98cee78eb8282e29fb6.js",revision:"b6d968e5af60e0e204db3d6890e0baca"},{url:"/_next/static/chunks/webpack-e067438c4cf4ef2ef178.js",revision:"8c19f623e8389f11131a054a7e17ff95"},{url:"/emojis/face-with-medical-mask_1f637.png",revision:"cd500abeb5369420d136cb5d3b5127a1"},{url:"/emojis/face-with-thermometer_1f912.png",revision:"19463eb1e3ea4570aaea7812cd1a61d3"},{url:"/emojis/man-dancing_1f57a.png",revision:"804289b56907d34f6d7558fd4f095d86"},{url:"/emojis/woman-zombie_1f9df-200d-2640-fe0f.png",revision:"777a3891f2e245232e3f5570a91f74aa"},{url:"/favicon-16x16.png",revision:"64af8f7f76fae715fd5a085f163690e0"},{url:"/favicon-32x32.png",revision:"2a736563016f154d1d6227e5d9ec2df2"},{url:"/favicon.ico",revision:"537a2f98624962a71a3603c61736c40a"},{url:"/fonts/montserrat-v15-latin-regular.eot",revision:"5cc74ef8a4c422084726eb9dd1163b82"},{url:"/fonts/montserrat-v15-latin-regular.svg",revision:"cf4574fbce791ed7debe1dee7f816283"},{url:"/fonts/montserrat-v15-latin-regular.ttf",revision:"6a9e85ac9247f5848db957b873c62e0c"},{url:"/fonts/montserrat-v15-latin-regular.woff",revision:"8102c4838f9e3d08dad644290a9cb701"},{url:"/fonts/montserrat-v15-latin-regular.woff2",revision:"bc3aa95dca08f5fee5291e34959c27bc"},{url:"/fonts/open-sans-v18-latin-700.eot",revision:"fc0dbb2edfac9ef855bcc6acd9e3477d"},{url:"/fonts/open-sans-v18-latin-700.svg",revision:"9f5a774538ba87b28526abd3e988eda8"},{url:"/fonts/open-sans-v18-latin-700.ttf",revision:"e5111caba5b811a73d995786db3c61ea"},{url:"/fonts/open-sans-v18-latin-700.woff",revision:"1f85e92d8ff443980bc0f83ad7b23b60"},{url:"/fonts/open-sans-v18-latin-700.woff2",revision:"0edb76284a7a0f8db4665b560ee2b48f"},{url:"/icons/icon-128x128.png",revision:"5e35510c248208f8d3ff7f01d041d419"},{url:"/icons/icon-144x144.png",revision:"517674a1abf566ec857cffae4a8e8289"},{url:"/icons/icon-152x152.png",revision:"97f891a7508f367da8b9a55060256a71"},{url:"/icons/icon-192x192.png",revision:"e6789740a7afc0cf2f9d4d87d0074f9c"},{url:"/icons/icon-384x384.png",revision:"9b6feb12d25636a2f1c6e8db65d40005"},{url:"/icons/icon-512x512.png",revision:"af2b70726a0c062b5af37a105aed9939"},{url:"/icons/icon-72x72.png",revision:"cd9ccf2b3ce72b1aff6a61c220ba09df"},{url:"/icons/icon-96x96.png",revision:"f50c760f0b0e782b6f543995bab7b771"},{url:"/images/ahrweiler%20(landkreis).png",revision:"c596a454aba6e8b5e302e747597a91b5"},{url:"/images/leipzig.png",revision:"20757943dd232e8316d149fde1621047"},{url:"/manifest.json",revision:"00cd9cb310faf37562575cc0ed7c6f53"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[new e.ExpirationPlugin({maxEntries:1,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\/api\/.*$/i,new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/.*/i,new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET")}));