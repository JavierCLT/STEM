// Independent check of the KDP Select 10% rule: scans everything the site publishes (dist/: HTML,
// llms.txt, books.json, sitemap...) for sentences from each manuscript and reports how much of each
// book appears. A sentence counts in full if it appears anywhere on the site.
// Needs the manuscripts (BOOK_SRC or .local/paths.json), so it runs locally, after `npm run build`.
// Run: npm run check:excerpts      Fails above 10%; warns above 8%.
import fs from 'node:fs';
import path from 'node:path';
import { parseChapter, parseIntro, chapterFiles, countWords } from './lib/book-parse.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const local = fs.existsSync(path.join(ROOT, '.local/paths.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, '.local/paths.json'), 'utf8')) : {};
const BOOK_SRC = process.env.BOOK_SRC || local.bookSrc;
const DIST = path.join(ROOT, 'dist');
if (!BOOK_SRC) { console.log('excerpt-audit: no manuscript folder configured, skipped.'); process.exit(0); }
if (!fs.existsSync(DIST)) throw new Error('Run the build first (dist/ not found).');

const LIMIT = 0.10;
const WARN = 0.08;

const norm = (s) => ' ' + String(s).toLowerCase()
  .replace(/[‘’“”"']/g, '')
  .replace(/\^\{([^}]*)\}|_\{([^}]*)\}/g, '$1$2')
  .normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻₀₁₂₃₄₅₆₇₈₉]/g, (c) => '0123456789-0123456789'['⁰¹²³⁴⁵⁶⁷⁸⁹⁻₀₁₂₃₄₅₆₇₈₉'.indexOf(c)])
  .replace(/&[a-z#0-9]+;/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';

// ---- everything the site publishes, as one normalized string
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(html|txt|json|xml|webmanifest)$/.test(e.name)) out.push(p);
  }
  return out;
}
const decode = (s) => s.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
let site = '';
for (const f of walk(DIST)) {
  let t = fs.readFileSync(f, 'utf8');
  if (f.endsWith('.html')) t = decode(t.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' '));
  site += norm(t) + ' | ';
}
const figureFiles = fs.readdirSync(path.join(DIST, '_astro'));

// ---- each book, sentence by sentence
const splitSentences = (s) => s.split(/(?<=[.!?]["”’]?)\s+(?=[A-Z“"'(])/);
let failed = false;
const rows = [];
for (let n = 1; n <= 7; n++) {
  const volDir = path.join(BOOK_SRC, `Vol${n}`);
  const units = [];
  const intro = parseIntro(path.join(volDir, '00-intro.md'));
  units.push(...intro.paragraphs);
  let figures = 0;
  for (const f of chapterFiles(volDir)) {
    const c = parseChapter(path.join(volDir, f));
    if (c.subtitle) units.push(c.subtitle);
    for (const [, t] of c.facts) units.push(t);
    for (const b of c.blocks) {
      if (b.kind === 'p' || b.kind === 'box' || b.kind === 'h2') units.push(b.text);
      if (b.kind === 'fig') { figures++; if (b.caption) units.push(b.caption); }
    }
  }
  const sentences = [...new Set(units.flatMap(splitSentences).map((s) => s.trim()).filter(Boolean))];
  let total = 0;
  let found = 0;
  for (const s of sentences) {
    const w = countWords(s);
    total += w;
    const ns = norm(s);
    if (w >= 3 && site.includes(ns)) found += w;
  }
  const shownFigures = new Set(figureFiles.filter((f) => f.startsWith(`v${n}-`)).map((f) => f.split('.')[0])).size;
  const share = found / total;
  const status = share > LIMIT ? 'FAIL' : share > WARN ? 'warn' : 'ok';
  if (share > LIMIT) failed = true;
  rows.push(`Vol ${n}: ${found} of ${total} words on the site = ${(share * 100).toFixed(2)}%  [${status}]   figures: ${shownFigures} of ${figures}`);
}
console.log('KDP Select excerpt audit (limit 10% per book, warning at 8%)');
for (const r of rows) console.log('  ' + r);
if (failed) { console.error('At least one book is over the 10% limit.'); process.exit(1); }
