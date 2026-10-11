const CACHE='canasta-v2';
const SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname.endsWith('supabase.co')||u.hostname.includes('generativelanguage'))return;
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
