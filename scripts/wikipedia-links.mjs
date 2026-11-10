// Finds the English Wikipedia article for every person in the series and writes src/data/wikipedia.json
// (name -> URL), used as schema.org sameAs so search engines and assistants can tie each chapter to the
// right entity. A page is accepted only if its summary mentions the person's birth year (and death year,
// when they have died). Run when the people change: node scripts/wikipedia-links.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/volumes.json'), 'utf8'));
const OUT = path.join(ROOT, 'src/data/wikipedia.json');
const UA = { 'User-Agent': 'famousinstem-site-build/1.0 (https://famousinstem.com)' };

// Article titles where the plain name is ambiguous or the article uses a longer form.
const TITLE_HINTS = {
  'Ibn Sina (Avicenna)': 'Avicenna',
  'John Nash': 'John Forbes Nash Jr.',
  'Charles Drew': 'Charles R. Drew',
  'Helen Taussig': 'Helen B. Taussig',
  'Carl Scheele': 'Carl Wilhelm Scheele',
  'Mokshagundam Visvesvaraya': 'M. Visvesvaraya',
  'James Watson': 'James Watson',
  'Paul Ehrlich': 'Paul Ehrlich',
  'Henri Becquerel': 'Henri Becquerel',
  'Bob Kahn': 'Bob Kahn',
  'Galen': 'Galen',
  'Euclid': 'Euclid',
  'E. O. Wilson': 'E. O. Wilson',
  'Lee de Forest': 'Lee de Forest',
  'Granville Woods': 'Granville Woods',
  'Daniel Hale Williams': 'Daniel Hale Williams',
  'Mario Molina': 'Mario Molina',
  'James Gosling': 'James Gosling',
  'Gordon Moore': 'Gordon Moore',
  'Michael Dell': 'Michael Dell',
};

// Checked by hand: their summaries give no dates (ancient) or only one of the years.
const MANUAL = {
  Eratosthenes: 'https://en.wikipedia.org/wiki/Eratosthenes',
  Euclid: 'https://en.wikipedia.org/wiki/Euclid',
  'Pierre de Fermat': 'https://en.wikipedia.org/wiki/Pierre_de_Fermat',
  'Mokshagundam Visvesvaraya': 'https://en.wikipedia.org/wiki/M._Visvesvaraya',
};

const people = [];
for (const v of data.volumes) {
  for (const p of v.people) {
    const years = (p.lifespan.match(/\d{3,4}/g) || []).map(Number);
    if (p.people.length === 1) people.push({ name: p.name, years });
    else {
      // pairs: lifespans are written "1928–2025 and 1916–2004" or "born 1938 and 1943"
      const parts = p.lifespan.split(' and ');
      p.people.forEach((name, i) => people.push({ name, years: (parts[i] || parts[0] || '').match(/\d{3,4}/g)?.map(Number) || [] }));
    }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function summary(title) {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}?redirect=true`, { headers: UA });
  if (!r.ok) return null;
  return r.json();
}
async function search(q) {
  const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=4&srsearch=${encodeURIComponent(q)}`, { headers: UA });
  if (!r.ok) return [];
  return (await r.json()).query.search.map((s) => s.title);
}
const matches = (s, years) => {
  if (!s || s.type === 'disambiguation') return false;
  const text = `${s.description || ''} ${s.extract || ''}`;
  return years.every((y) => text.includes(String(y)));
};

const out = {};
const misses = [];
for (const p of people) {
  if (MANUAL[p.name]) { out[p.name] = MANUAL[p.name]; continue; }
  const tries = [TITLE_HINTS[p.name] || p.name];
  let hit = null;
  for (const t of tries) {
    const s = await summary(t);
    if (matches(s, p.years)) { hit = s; break; }
  }
  if (!hit) {
    for (const t of await search(`${p.name} ${p.years[0] || ''}`)) {
      const s = await summary(t);
      if (matches(s, p.years)) { hit = s; break; }
      await sleep(150);
    }
  }
  if (hit) out[p.name] = hit.content_urls.desktop.page;
  else misses.push(`${p.name} (${p.years.join(', ')})`);
  await sleep(120);
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`linked ${Object.keys(out).length} of ${people.length}`);
if (misses.length) console.log('not linked (years not confirmed):\n  ' + misses.join('\n  '));
