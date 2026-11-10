// Builds src/data/generated/volumes.json and the image masters in src/assets from the book sources.
// Only the pieces named in scripts/excerpt-picks.json (plus each chapter's name, subtitle, big idea and
// years) leave the manuscript; the full chapters never enter this repository.
//
// Source folders come from .local/paths.json (not committed) or environment variables:
//   BOOK_SRC   folder that holds Vol1..Vol7 chapter Markdown, figures/ and figures-ai/
//   COVER_SRC  folder with the Kindle front covers (volume-N-...-ebook-1600x2560.jpg)
// Run: npm run content
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { parseChapter, parseIntro, chapterFiles, bookTotals, countWords, smartQuotes } from './lib/book-parse.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const local = fs.existsSync(path.join(ROOT, '.local/paths.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, '.local/paths.json'), 'utf8')) : {};
const BOOK_SRC = process.env.BOOK_SRC || local.bookSrc;
const COVER_SRC = process.env.COVER_SRC || local.coverSrc;
if (!BOOK_SRC || !fs.existsSync(BOOK_SRC)) throw new Error('Set BOOK_SRC or .local/paths.json { "bookSrc": ... } to the folder holding Vol1..Vol7');

const PICKS = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/excerpt-picks.json'), 'utf8'));
const OUT_JSON = path.join(ROOT, 'src/data/generated/volumes.json');
const ASSETS = path.join(ROOT, 'src/assets');

// ---------------------------------------------------------------- names
const PARTICLES = new Set(['van', 'von', 'de', 'da', 'and', 'der']);
const NAME_OVERRIDES = {
  'SIR ISAAC NEWTON': 'Isaac Newton',
  'SIR JAMES CHADWICK': 'James Chadwick',
  'ANTOINE HENRI BECQUEREL': 'Henri Becquerel',
  'IBN SINA (AVICENNA)': 'Ibn Sina (Avicenna)',
  'BOB KAHN and VINT CERF': 'Bob Kahn and Vint Cerf',
  'LARRY PAGE and SERGEY BRIN': 'Larry Page and Sergey Brin',
  'JAMES WATSON and FRANCIS CRICK': 'James Watson and Francis Crick',
};
// Chapters that profile two people: the people inside, for the index and structured data.
const PAIRS = {
  'BOB KAHN and VINT CERF': ['Bob Kahn', 'Vint Cerf'],
  'LARRY PAGE and SERGEY BRIN': ['Larry Page', 'Sergey Brin'],
  'JAMES WATSON and FRANCIS CRICK': ['James Watson', 'Francis Crick'],
};
function displayName(raw) {
  if (NAME_OVERRIDES[raw]) return NAME_OVERRIDES[raw];
  return raw.split(' ').map((w, i) => {
    if (/^Mc[A-Z]/.test(w)) return 'Mc' + w.slice(2, 3) + w.slice(3).toLowerCase();
    const lw = w.toLowerCase();
    if (i > 0 && PARTICLES.has(lw)) return lw;
    if (/^[A-Z]\.$/.test(w)) return w;
    return lw.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('-');
  }).join(' ');
}
const slugify = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ø/gi, 'o').replace(/ő/gi, 'o').toLowerCase()
  .replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------------------------------------------------------------- years
// Lifespans for the index, derived from the fact box. Irregular entries are set by hand.
const LIFESPAN_OVERRIDES = {
  'BOB KAHN and VINT CERF': 'born 1938 and 1943',
  'LARRY PAGE and SERGEY BRIN': 'both born 1973',
  'JAMES WATSON and FRANCIS CRICK': '1928–2025 and 1916–2004',
  'PIERRE DE FERMAT': '1601 or 1607–1665',
  'FIBONACCI': 'c. 1170–after 1240',
};
function yearOf(s) {
  if (!s) return null;
  const t = s.replace(/\(.*?\)/g, '');
  const m = t.match(/(about|after|before)?\s*(AD\s+)?(\d{3,4})(\s*BC)?/i);
  if (!m) return null;
  return { year: Number(m[3]), approx: /about/i.test(m[1] || ''), qual: /after|before/i.test(m[1] || '') ? m[1].toLowerCase() : '', bc: !!m[4], ad: !!m[2] };
}
function lifespan(raw, facts) {
  if (LIFESPAN_OVERRIDES[raw]) return LIFESPAN_OVERRIDES[raw];
  const f = Object.fromEntries(facts);
  const b = yearOf(f['Born']);
  const d = yearOf(f['Died']);
  if (!b) return '';
  const c = (y) => (y.approx ? 'c. ' : '') + (y.qual ? y.qual + ' ' : '');
  if (!d) return `born ${b.year}`;
  if (b.bc && d.bc) return `${c(b)}${b.year}–${d.year} BC`;
  if (b.ad) return `${c(b)}AD ${b.year}–${d.year}`;
  return `${c(b)}${b.year}–${c(d)}${d.year}`;
}

// ---------------------------------------------------------------- text helpers
// First sentence of a paragraph; ignores the periods in initials such as "J. P. Morgan".
function firstSentence(p) {
  const re = /[.!?]["”’]?(?=\s+[A-Z“"])/g;
  let m;
  while ((m = re.exec(p))) {
    const before = p.slice(0, m.index + 1);
    if (/(\b[A-Z]\.|\bSt\.|\bMr\.|\bDr\.|\bMrs\.|\bNo\.)$/.test(before)) continue;
    return p.slice(0, m.index + m[0].length).trim();
  }
  return p;
}
// Book-style inline markup: ^{..} superscript, _{..} subscript; keep as text with Unicode when simple.
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '−': '⁻', '-': '⁻' };
const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
const clean = (s) => smartQuotes(String(s)
  .replace(/\^\{([^}]*)\}/g, (_, x) => [...x].map((ch) => SUP[ch] ?? ch).join(''))
  .replace(/_\{([^}]*)\}/g, (_, x) => [...x].map((ch) => SUB[ch] ?? ch).join(''))
  .replace(/\*\*(.+?)\*\*/g, '$1')
  .replace(/\*(.+?)\*/g, '$1'));

// ---------------------------------------------------------------- images
const figurePath = (v, slot) => {
  const meta = path.join(BOOK_SRC, 'figures-ai', `Vol${v}`, `${slot}.json`);
  const accepted = fs.existsSync(meta) && JSON.parse(fs.readFileSync(meta, 'utf8')).status === 'accepted';
  return accepted ? path.join(BOOK_SRC, 'figures-ai', `Vol${v}`, `${slot}.png`) : path.join(BOOK_SRC, 'figures', `Vol${v}`, `${slot}.png`);
};
async function writeImage(src, dest, { width, format = 'jpeg', quality = 90, flatten = false }) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let img = sharp(src);
  if (flatten) img = img.flatten({ background: '#ffffff' });
  img = img.resize({ width, withoutEnlargement: true });
  img = format === 'png' ? img.png({ compressionLevel: 9, palette: true, colors: 64 }) : img.jpeg({ quality, mozjpeg: true });
  await img.toFile(dest);
  return path.relative(ROOT, dest).replace(/\\/g, '/');
}
const findFile = (dir, re) => dir && fs.existsSync(dir) ? fs.readdirSync(dir).find((f) => re.test(f)) : null;

// ---------------------------------------------------------------- main
const volumes = [];
for (let n = 1; n <= 7; n++) {
  const volDir = path.join(BOOK_SRC, `Vol${n}`);
  const totals = bookTotals(volDir);
  const pick = PICKS[String(n)];
  const used = []; // every string copied from the book, for the word count

  const people = totals.chapters.map((c) => {
    const raw = c.name;
    const name = displayName(raw);
    const f = Object.fromEntries(c.facts);
    const entry = {
      chapter: c.file.replace(/\.md$/, ''),
      slug: slugify(name),
      name,
      people: PAIRS[raw] || [name],
      subtitle: clean(c.subtitle || ''),
      bigIdea: clean(f['Big idea'] || ''),
      lifespan: lifespan(raw, c.facts),
    };
    used.push(entry.name, entry.subtitle, entry.bigIdea, entry.lifespan);
    return entry;
  });

  const intro = parseIntro(path.join(volDir, '00-intro.md'));
  const introExcerpt = intro.paragraphs.slice(0, pick.introParagraphs).map(clean);
  used.push(...introExcerpt);

  // Opening: the first N paragraphs of one chapter, with the subheads that fall between them.
  const oc = parseChapter(path.join(volDir, `${pick.opening.chapter}.md`));
  const openingBlocks = [];
  let paras = 0;
  for (const b of oc.blocks) {
    if (paras >= pick.opening.paragraphs) break;
    if (b.kind === 'p') { openingBlocks.push({ kind: 'p', text: clean(b.text) }); paras++; }
    else if (b.kind === 'h2') openingBlocks.push({ kind: 'h2', text: clean(b.text) });
  }
  if (openingBlocks.at(-1)?.kind === 'h2') openingBlocks.pop();
  used.push(...openingBlocks.map((b) => b.text));
  const openingPerson = people.find((p) => p.chapter === pick.opening.chapter);

  const boxes = pick.boxes.map((ref) => {
    const [file, k] = ref.split('#');
    const c = parseChapter(path.join(volDir, `${file}.md`));
    const box = c.blocks.filter((b) => b.kind === 'box')[Number(k) - 1];
    if (!box) throw new Error(`Vol ${n}: no box ${ref}`);
    const person = people.find((p) => p.chapter === file);
    used.push(box.text);
    return { person: person.slug, name: person.name, label: box.label, text: clean(box.text) };
  });

  const hooks = pick.hooks.map((file) => {
    const c = parseChapter(path.join(volDir, `${file}.md`));
    const p1 = c.blocks.find((b) => b.kind === 'p');
    const person = people.find((p) => p.chapter === file);
    const text = clean(firstSentence(p1.text));
    used.push(text);
    return { person: person.slug, name: person.name, text };
  });

  const figures = [];
  for (const slot of pick.figures) {
    const file = slot.replace(/-\d+$/, '');
    const k = Number(slot.match(/-(\d+)$/)[1]);
    const c = parseChapter(path.join(volDir, `${file}.md`));
    const fig = c.blocks.filter((b) => b.kind === 'fig')[k - 1];
    if (!fig) throw new Error(`Vol ${n}: no figure ${slot}`);
    const person = people.find((p) => p.chapter === file);
    const src = await writeImage(figurePath(n, slot), path.join(ASSETS, 'figures', `v${n}-${slot}.png`), { width: 1400, format: 'png', flatten: true });
    used.push(fig.caption);
    figures.push({ person: person.slug, name: person.name, caption: clean(fig.caption), alt: clean(fig.what), src });
  }

  // Front cover (a marketing image, not interior content).
  const coverFile = findFile(COVER_SRC, new RegExp(`^volume-${n}-.*\\.(jpe?g|png)$`, 'i'));
  const cover = coverFile ? await writeImage(path.join(COVER_SRC, coverFile), path.join(ASSETS, 'covers', `vol-${n}.jpg`), { width: 1000, quality: 88 }) : null;

  // Unique copied strings only: the same sentence shown twice is still one excerpt.
  const uniq = [...new Set(used.filter(Boolean))];
  const excerptWords = uniq.reduce((s, t) => s + countWords(t), 0);
  volumes.push({
    n,
    chapters: totals.chapters.length,
    peopleCount: people.reduce((s, p) => s + p.people.length, 0),
    totals: { words: totals.words, figures: totals.figures },
    excerpt: { words: excerptWords, figures: figures.length, textShare: +(excerptWords / totals.words).toFixed(4) },
    intro: { heading: clean(intro.heading), paragraphs: introExcerpt },
    opening: { person: openingPerson.slug, name: openingPerson.name, subtitle: openingPerson.subtitle, blocks: openingBlocks },
    boxes,
    hooks,
    figures,
    cover,
    people,
  });
  console.log(`Vol ${n}: ${people.length} chapters, ${excerptWords} of ${totals.words} words excerpted (${(100 * excerptWords / totals.words).toFixed(2)}%), ${figures.length} of ${totals.figures} figures`);
}

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ generated: new Date().toISOString().slice(0, 10), volumes }, null, 2) + '\n');
console.log('wrote', path.relative(ROOT, OUT_JSON));
