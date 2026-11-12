// Renders the free printables to PDF (and PNG previews) with headless Chrome:
//   public/printables/biography-project-worksheet.pdf  (US Letter, 2 pages)
//   public/printables/women-in-stem-timeline.pdf       (Tabloid 11x17 landscape)
//   src/assets/printables/*.png                        (previews for the site)
// Uses only text already on the site (names, years, chapter subtitles). Run: node scripts/make-printables.mjs
// Needs Google Chrome or Microsoft Edge installed (CHROME_PATH overrides the default location).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/volumes.json'), 'utf8'));
const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error('Chrome not found; set CHROME_PATH');

const FIELD = { 1: 'Physics', 2: 'Mathematics', 3: 'Computing', 4: 'Chemistry', 5: 'Biology', 6: 'Medicine', 7: 'Engineering' };
const TITLE = { 1: 'The Greatest Physicists', 2: 'Mathematical Masterminds', 3: 'Tech Titans of Silicon Valley', 4: 'Explosive Chemists', 5: 'Brilliant Biologists', 6: 'Medical Pioneers', 7: 'Extraordinary Engineers' };
const ACC = { 1: '#e0a800', 2: '#d6247f', 3: '#00a3b4', 4: '#9a6ad6', 5: '#3fa52a', 6: '#e23a49', 7: '#e98a00' };
const font = fs.readFileSync(path.join(ROOT, 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2')).toString('base64');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const spectrum = `linear-gradient(90deg,#ffcb2b 0 14.28%,#f0489f 0 28.57%,#26d6e6 0 42.85%,#cca4f6 0 57.14%,#78d857 0 71.42%,#fc606c 0 85.71%,#fca82c 0)`;
const mark = fs.readFileSync(path.join(ROOT, 'public/favicon.svg'), 'utf8');
const base = `@font-face{font-family:Archivo;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}
*{box-sizing:border-box}html,body{margin:0}body{font-family:Archivo,Arial,sans-serif;color:#141829;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.mark{display:inline-flex;align-items:center;gap:6px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.mark svg{width:20px;height:20px}`;

// ------------------------------------------------------------------ worksheet
function worksheet() {
  const lines = (n) => Array.from({ length: n }, () => '<div class="ln"></div>').join('');
  const fields = Object.values(FIELD).map((f) => `<span class="cb"></span>${f}`).join('&nbsp;&nbsp; ');
  // The heading travels with its first three names, so no column ends on a bare heading.
  const item = (p) => `<div class="it"><span class="cb"></span>${esc(p.name)} <i>${esc(p.lifespan)}</i></div>`;
  const picker = data.volumes.map((v) => `
    <section class="vol" style="--a:${ACC[v.n]}">
      <div class="keep"><h3>${FIELD[v.n]} <small>Vol. ${v.n}: ${esc(TITLE[v.n])}</small></h3>${v.people.slice(0, 3).map(item).join('')}</div>
      ${v.people.slice(3).map(item).join('')}
    </section>`).join('');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>STEM biography project worksheet</title><style>${base}
@page{size:Letter;margin:0.5in}
.page{page-break-after:always}.page:last-child{page-break-after:auto}
@media screen{.page{width:8.5in;height:11in;padding:.5in;overflow:hidden}}
.top{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid transparent;border-image:${spectrum} 1;padding-bottom:6px;margin-bottom:12px;font-size:9pt}
h1{font-size:22pt;font-weight:900;letter-spacing:-.02em;margin:0 0 2px}
.sub{margin:0 0 12px;color:#474c63;font-size:9.5pt}
.row{display:flex;gap:18px;margin-bottom:8px;font-size:9.5pt;align-items:flex-end}.row>div{flex:1;display:flex;gap:6px;align-items:flex-end}.row b{white-space:nowrap}
.fill{flex:1;border-bottom:1px solid #9aa0b5;height:16px}
.q{margin:10px 0 0}.q h2{font-size:11pt;margin:0 0 1px;font-weight:800}.q p{margin:0 0 2px;font-size:8.5pt;color:#5c6179}
.ln{border-bottom:1px solid #c5c9d6;height:21px}
.cb{display:inline-block;width:9px;height:9px;border:1.2px solid #474c63;border-radius:2px;margin-right:4px;vertical-align:-1px}
.fields{font-size:9pt;margin:2px 0 4px}
table{width:100%;border-collapse:collapse;font-size:8.5pt;margin-top:3px}th{text-align:left;font-weight:800;color:#474c63;border-bottom:1.5px solid #474c63;padding:2px 4px}td{border-bottom:1px solid #c5c9d6;height:24px}
.foot{margin-top:12px;font-size:8pt;color:#5c6179;display:flex;justify-content:space-between}
.pick h1{font-size:18pt}.cols{columns:4;column-gap:14px;font-size:7.5pt}
.vol{margin-bottom:8px}.keep{break-inside:avoid}.vol h3{margin:0 0 3px;font-size:9pt;font-weight:900;border-bottom:2px solid var(--a);padding-bottom:1px}.vol h3 small{display:block;font-weight:600;font-size:6.8pt;color:#5c6179}
.it{line-height:1.35;padding-left:11px;text-indent:-11px;break-inside:avoid}.it i{color:#6b7088;font-style:normal;font-size:6.8pt}.vol .cb{width:7px;height:7px}
</style><body>
<div class="page">
  <div class="top"><span class="mark">${mark}Famous in STEM</span><span>Free printable · famousinstem.com/printables/</span></div>
  <h1>My STEM Biography Project</h1>
  <p class="sub">Choose a scientist, inventor, doctor or engineer (there are 161 to pick from on page 2), read about them, then fill this in. Use your own words.</p>
  <div class="row"><div><b>Name</b><span class="fill"></span></div><div style="flex:.6"><b>Class</b><span class="fill"></span></div><div style="flex:.6"><b>Date</b><span class="fill"></span></div></div>
  <div class="row"><div><b>The person I chose</b><span class="fill"></span></div><div style="flex:.7"><b>Lived</b><span class="fill"></span></div></div>
  <div class="fields"><b>Field:</b>&nbsp; ${fields}</div>
  <div class="q"><h2>Where did they grow up, and how did they get into science?</h2>${lines(2)}</div>
  <div class="q"><h2>The moment that changed everything</h2><p>When and where was it? Who was there? What happened?</p>${lines(4)}</div>
  <div class="q"><h2>Their big idea, in my own words</h2><p>Explain it so a younger student would understand.</p>${lines(4)}</div>
  <div class="q"><h2>What stood in their way?</h2><p>Money, war, prejudice, people who disagreed, a missing tool…</p>${lines(2)}</div>
  <div class="q"><h2>How did they test or prove the idea?</h2>${lines(2)}</div>
  <div class="q"><h2>What is different today because of them?</h2>${lines(2)}</div>
  <div class="q"><h2>Three facts and where I found them</h2>
    <table><tr><th style="width:62%">Fact</th><th>Source (book, page or website)</th></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table></div>
  <div class="q"><h2>One question I would ask them</h2>${lines(1)}</div>
  <div class="foot"><span>© 2026 Javier Sanz · Free to copy for classroom and home use.</span><span>Every person on page 2 has a chapter in the Famous in STEM books.</span></div>
</div>
<div class="page pick">
  <div class="top"><span class="mark">${mark}Famous in STEM</span><span>Their big ideas, in one sentence each: famousinstem.com/people/</span></div>
  <h1>Choose your scientist</h1>
  <p class="sub">Tick the one you will research. Not sure? Pick someone whose invention or idea you use every day.</p>
  <div class="cols">${picker}</div>
</div>
</body></html>`;
}

// ------------------------------------------------------------------ women in STEM poster
const WOMEN = new Set(['Marie Curie', 'Ada Lovelace', 'Katherine Johnson', 'Grace Hopper', 'Rosalind Franklin', 'Alice Ball', 'Dorothy Hodgkin',
  'Gertrude Elion', 'Tu Youyou', 'Stephanie Kwolek', 'Jane Goodall', 'Rachel Carson', 'Barbara McClintock', 'Dian Fossey', 'Lynn Margulis',
  'Wangari Maathai', 'Mary Anning', 'Florence Nightingale', 'Elizabeth Blackwell', 'Virginia Apgar', 'Helen Taussig', 'Rebecca Lee Crumpler',
  'Emily Warren Roebling', 'Lillian Gilbreth', 'Hertha Ayrton', 'Ellen Swallow Richards']);
export const women = data.volumes
  .flatMap((v) => v.people.filter((p) => WOMEN.has(p.name)).map((p) => ({ ...p, vol: v.n, born: Number(p.lifespan.match(/\d{4}/)[0]) })))
  .sort((a, b) => a.born - b.born || a.name.localeCompare(b.name));

function poster() {
  const cards = women.map((w, i) => `
    <article style="--a:${ACC[w.vol]}">
      <div class="yr">${w.born}</div>
      <h2>${esc(w.name)}</h2>
      <p class="life">${esc(w.lifespan)} · ${FIELD[w.vol]}</p>
      <p class="sub">${esc(w.subtitle)}</p>
      <p class="vol">Vol. ${w.vol}: ${esc(TITLE[w.vol])}</p>
      ${i < women.length - 1 ? '<span class="arrow"></span>' : ''}
    </article>`).join('');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>Women Who Shaped STEM timeline</title><style>${base}
@page{size:17in 11in;margin:0}
body{width:17in;height:11in;overflow:hidden;background:#fffdf8;position:relative}
.band{height:10px;background:${spectrum}}
header{display:flex;justify-content:space-between;align-items:flex-end;padding:.32in .45in .18in}
header h1{font-size:46pt;font-weight:900;letter-spacing:-.035em;line-height:.95;margin:0;color:#0f152d}
header h1 span{background:linear-gradient(90deg,#d6247f,#9a6ad6 45%,#00a3b4);-webkit-background-clip:text;background-clip:text;color:transparent}
header p{margin:6px 0 0;font-size:14pt;color:#474c63}
header .right{text-align:right;font-size:11pt;color:#474c63;line-height:1.45}.right .mark{display:flex;justify-content:flex-end;font-size:13pt;color:#0f152d;margin-bottom:6px}.right .mark svg{width:30px;height:30px}
main{display:grid;grid-template-columns:repeat(7,1fr);gap:.17in .2in;padding:.06in .45in 0}
article{position:relative;background:#fff;border:1px solid #e3ddcd;border-top:5px solid var(--a);border-radius:6px;padding:.1in .13in .1in;height:2.13in;display:flex;flex-direction:column}
.yr{font-size:22pt;font-weight:900;color:var(--a);line-height:1;letter-spacing:-.02em}
article h2{font-size:12.5pt;font-weight:850;margin:.04in 0 .01in;line-height:1.05;letter-spacing:-.01em}
.life{margin:0;font-size:8.5pt;color:#5c6179;font-weight:600}
.sub{margin:.06in 0 0;font-family:Georgia,serif;font-style:italic;font-size:10pt;line-height:1.25;color:#2c2f40}
.vol{margin:auto 0 0;font-size:7.6pt;font-weight:700;color:var(--a)}
.arrow{position:absolute;right:-.17in;top:.28in;width:.14in;height:2px;background:#c9c2b0}
.arrow::after{content:'';position:absolute;right:-1px;top:-3px;border:4px solid transparent;border-left:5px solid #c9c2b0;border-right:0}
article:nth-child(7n) .arrow{display:none}
.info{grid-column:span 2;background:#0f152d;color:#f4f1ea;border-radius:6px;padding:.16in .2in;display:flex;flex-direction:column;justify-content:center;font-size:10.5pt;line-height:1.4;height:2.13in}
.info b{font-size:15pt;display:block;margin-bottom:.05in;color:#fff}.info .u{color:#ffcb2b;font-weight:800;font-size:12pt;margin-top:.06in}
</style><body>
<div class="band"></div>
<header>
  <div><h1>Women who shaped <span>STEM</span></h1><p>26 scientists, mathematicians, doctors and engineers, in order of birth, from 1799 to 1940.</p></div>
  <div class="right"><div class="mark">${mark}Famous in STEM</div>Each one has a chapter in the Famous in STEM books.<br>Free poster · famousinstem.com/printables/</div>
</header>
<main>${cards}
  <div class="info"><b>Read their stories</b>Every name on this poster is a short, true chapter: the moment that changed everything, and the idea in plain words.<span class="u">famousinstem.com</span></div>
</main>
</body></html>`;
}

// ------------------------------------------------------------------ render
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fis-print-'));
const profile = path.join(tmp, 'profile');
const outPdf = path.join(ROOT, 'public/printables');
const outPng = path.join(ROOT, 'src/assets/printables');
fs.mkdirSync(outPdf, { recursive: true });
fs.mkdirSync(outPng, { recursive: true });
const chrome = (args) => execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, ...args], { stdio: 'pipe', timeout: 120000 });

try {
  const jobs = [
    { name: 'biography-project-worksheet', html: worksheet(), shot: '--window-size=816,1056' },
    { name: 'women-in-stem-timeline', html: poster(), shot: '--window-size=1632,1056' },
  ];
  for (const j of jobs) {
    const file = path.join(tmp, `${j.name}.html`);
    fs.writeFileSync(file, j.html);
    const url = pathToFileURL(file).href;
    chrome(['--no-pdf-header-footer', `--print-to-pdf=${path.join(outPdf, `${j.name}.pdf`)}`, url]);
    chrome([j.shot, '--hide-scrollbars', '--force-device-scale-factor=1.5', `--screenshot=${path.join(outPng, `${j.name}.png`)}`, url]);
    console.log('wrote', j.name);
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true }); // never leave Chrome profiles behind
}
