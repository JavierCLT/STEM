// Tells Bing, Yandex, Seznam and Naver (IndexNow) that the site's pages changed. Bing's index also feeds
// ChatGPT search and Copilot. Run after a deploy that changes content: node scripts/indexnow.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const HOST = 'famousinstem.com';
const key = fs.readdirSync(path.join(ROOT, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.replace('.txt', '');
if (!key) throw new Error('No IndexNow key file in public/');

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/famousinstem\.com[^<]*)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${res.status}`);
