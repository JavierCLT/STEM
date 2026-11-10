// Checks the built site in dist/ and fails the build on problems a visitor or a crawler would hit:
// broken internal links or anchors, missing or duplicate titles/descriptions/canonicals, more or fewer
// than one <h1>, images without alt text, and JSON-LD that does not parse.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://famousinstem.com';

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(DIST);

const errors = [];
const warn = [];
const urlOf = (file) => '/' + path.relative(DIST, file).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '');
const idsByUrl = new Map();
const html = new Map();
for (const f of pages) {
  const t = fs.readFileSync(f, 'utf8');
  html.set(urlOf(f), t);
  idsByUrl.set(urlOf(f), new Set([...t.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const titles = new Map();
const descs = new Map();
for (const [url, t] of html) {
  const is404 = url === '/404';
  const title = t.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = t.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canon = t.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1s = (t.match(/<h1[\s>]/g) || []).length;
  if (!title) errors.push(`${url}: no <title>`);
  else {
    if (title.length > 70) warn.push(`${url}: title is ${title.length} characters`);
    if (titles.has(title)) errors.push(`${url}: same title as ${titles.get(title)}`);
    titles.set(title, url);
  }
  if (!desc) errors.push(`${url}: no meta description`);
  else {
    if (desc.length < 70 || desc.length > 170) warn.push(`${url}: description is ${desc.length} characters`);
    if (descs.has(desc)) errors.push(`${url}: same description as ${descs.get(desc)}`);
    descs.set(desc, url);
  }
  if (!canon?.startsWith(SITE)) errors.push(`${url}: canonical missing or not absolute`);
  else if (!is404 && canon !== SITE + url) errors.push(`${url}: canonical ${canon} does not match the page URL`);
  if (h1s !== 1) errors.push(`${url}: ${h1s} <h1> elements`);
  for (const m of t.matchAll(/<img\b[^>]*>/g)) if (!/\salt(="|[\s>])/.test(m[0])) errors.push(`${url}: <img> without alt: ${m[0].slice(0, 80)}`);
  for (const m of t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { errors.push(`${url}: JSON-LD does not parse (${e.message})`); }
  }
  // internal links and anchors
  for (const m of t.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    const [p, hash] = href.split('#');
    const target = p === '' ? url : p;
    if (!target.startsWith('/')) continue;
    const clean = target.split('?')[0];
    const file = path.join(DIST, clean.endsWith('/') ? clean + 'index.html' : clean);
    const exists = fs.existsSync(file) || fs.existsSync(path.join(DIST, clean, 'index.html')) || fs.existsSync(path.join(DIST, clean + '.html'));
    if (!exists) { errors.push(`${url}: broken link ${href}`); continue; }
    if (hash) {
      const key = clean.replace(/\/$/, '') === '' ? '/' : clean.endsWith('/') ? clean : clean + '/';
      const ids = idsByUrl.get(key) || idsByUrl.get(clean);
      if (ids && !ids.has(hash)) errors.push(`${url}: link to missing anchor ${href}`);
    }
  }
}

const size = (p) => fs.statSync(path.join(DIST, p)).size;
console.log(`postbuild: ${pages.length} pages checked; home ${(size('index.html') / 1024).toFixed(0)} KB HTML`);
for (const w of warn) console.log('  warning: ' + w);
if (errors.length) {
  for (const e of errors) console.error('  error: ' + e);
  process.exit(1);
}
console.log('  no errors');
