// Parses the Famous in STEM chapter Markdown (the same skeleton the book build uses):
// # NAME / *subtitle* / > **Born:** ... fact box / paragraphs, ## subheads, boxes, [FIGURE: ...] lines.
import fs from 'node:fs';
import path from 'node:path';

export const BOX_LABELS = ['Try this:', 'Look around you:', 'Think about it:'];
const FIG_RE = /^\[FIGURE:\s*(?<what>.*?)\s*\|\s*source:\s*(?<src>.*?)\s*(\|\s*caption:\s*(?<cap>.*?))?\s*\]$/i;

// Same curling rules as the book build, so excerpts match the printed page.
export function smartQuotes(s) {
  s = s.replace(/---/g, '\u2014').replace(/--/g, '\u2013');
  s = s.replace(/(^|[\s(\[\u2014\u2013"])'/g, '$1\u2018').replace(/'/g, '\u2019');
  s = s.replace(/(^|[\s(\[\u2014\u2013])"/g, '$1\u201c').replace(/"/g, '\u201d');
  return s;
}

// Word count used for every share calculation (same token rule as the book build).
export function countWords(s) {
  return (String(s).match(/[A-Za-z0-9'\u2019\u00C0-\u024F-]+/g) || []).length;
}

export function parseChapter(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const out = { file: path.basename(file), name: null, subtitle: null, facts: [], blocks: [] };
  let i = 0;
  const skip = () => { while (i < lines.length && !lines[i].trim()) i++; };
  skip();
  if (lines[i]?.startsWith('# ')) out.name = lines[i++].slice(2).trim();
  skip();
  if (/^\*[^*].*\*$/.test(lines[i]?.trim() ?? '')) out.subtitle = lines[i++].trim().replace(/^\*|\*$/g, '').trim();
  skip();
  while (i < lines.length && lines[i].startsWith('>')) {
    const m = lines[i].match(/^>\s*\*\*(.+?):?\*\*:?\s*(.*)$/);
    if (m) out.facts.push([m[1].trim().replace(/:$/, ''), m[2].trim()]);
    i++;
  }
  let para = [];
  const flush = () => {
    const p = para.map((x) => x.trim()).join(' ').trim();
    para = [];
    if (!p) return;
    const lab = BOX_LABELS.find((l) => p.startsWith(`**${l}**`));
    if (lab) out.blocks.push({ kind: 'box', label: lab.replace(/:$/, ''), text: p.slice(lab.length + 4).trim() });
    else out.blocks.push({ kind: 'p', text: p });
  };
  let figK = 0;
  for (; i < lines.length; i++) {
    const s = lines[i].trim();
    if (!s) flush();
    else if (s.startsWith('## ')) { flush(); out.blocks.push({ kind: 'h2', text: s.slice(3).trim() }); }
    else if (s.startsWith('[FIGURE')) {
      flush();
      const m = s.match(FIG_RE);
      if (m) out.blocks.push({ kind: 'fig', k: ++figK, what: m.groups.what, src: m.groups.src.trim(), caption: (m.groups.cap || '').trim() });
    } else para.push(lines[i]);
  }
  flush();
  out.words = out.blocks.reduce((n, b) => n + (b.kind === 'p' || b.kind === 'box' ? countWords(b.text) : 0), 0);
  out.factWords = out.facts.reduce((n, [l, t]) => n + countWords(t), 0);
  out.titleWords = countWords(out.name) + countWords(out.subtitle || '');
  out.captionWords = out.blocks.filter((b) => b.kind === 'fig').reduce((n, b) => n + countWords(b.caption), 0);
  out.h2Words = out.blocks.filter((b) => b.kind === 'h2').reduce((n, b) => n + countWords(b.text), 0);
  return out;
}

export function parseIntro(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const heading = paras[0].startsWith('# ') ? paras.shift().slice(2).trim() : 'Before you start';
  return { heading, paragraphs: paras, words: paras.reduce((n, p) => n + countWords(p), 0) };
}

export function chapterFiles(volDir) {
  return fs.readdirSync(volDir).filter((f) => /^\d\d-.*\.md$/.test(f) && !f.startsWith('00-')).sort();
}

// Every word a reader sees in the book: intro + chapter titles, fact boxes, body, boxes, subheads, captions.
export function bookTotals(volDir) {
  const intro = parseIntro(path.join(volDir, '00-intro.md'));
  const chapters = chapterFiles(volDir).map((f) => parseChapter(path.join(volDir, f)));
  const words = intro.words + chapters.reduce((n, c) => n + c.words + c.factWords + c.titleWords + c.captionWords + c.h2Words, 0);
  const figures = chapters.reduce((n, c) => n + c.blocks.filter((b) => b.kind === 'fig').length, 0);
  return { intro, chapters, words, figures };
}
