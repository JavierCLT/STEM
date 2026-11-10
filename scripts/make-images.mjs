// Renders the favicons and the 1200x630 social images into public/.
// Uses Arial Black (the cover typeface) through the system's fonts, so run it on a machine that has Arial,
// then commit the PNG/JPG output. Run: node scripts/make-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const PUB = path.join(ROOT, 'public');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/volumes.json'), 'utf8'));
const siteTs = fs.readFileSync(path.join(ROOT, 'src/data/site.ts'), 'utf8');
const field = (n, key) => {
  const block = siteTs.split(/\n  \{\n    n: /)[n];
  return block.match(new RegExp(`\\n    ${key}: '([^']*)'`))[1];
};
const NAVY = '#0f152d';
const ACC = ['#ffcb2b', '#f0489f', '#26d6e6', '#cca4f6', '#78d857', '#fc606c', '#fca82c'];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/’/g, '&#8217;');

// ---- icons
const svgIcon = fs.readFileSync(path.join(PUB, 'favicon.svg'));
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(svgIcon, { density: 600 }).resize(size, size).png().toFile(path.join(PUB, name));
}

// ---- social images
fs.mkdirSync(path.join(PUB, 'og'), { recursive: true });
const stripe = ACC.map((c, i) => `<rect x="${(i * 1200) / 7}" y="0" width="${1200 / 7 + 1}" height="10" fill="${c}"/>`).join('');

async function cover(n, h) {
  const src = path.join(ROOT, data.volumes[n - 1].cover);
  return sharp(src).resize({ height: h }).toBuffer();
}
function wrap(text, max) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) { lines.push(line.trim()); line = w; } else line += ' ' + w;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

async function bookOg(v) {
  const n = v.n;
  const acc = ACC[n - 1];
  const title = field(n, 'title');
  const tagline = field(n, 'tagline');
  const titleLines = wrap(title.toUpperCase(), 15);
  const size = titleLines.length > 2 ? 58 : 70;
  const tagLines = wrap(tagline, 36);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><radialGradient id="g" cx="0.85" cy="0.2" r="0.8"><stop offset="0" stop-color="${acc}" stop-opacity="0.28"/><stop offset="0.6" stop-color="${NAVY}" stop-opacity="0"/></radialGradient></defs>
    <rect width="1200" height="630" fill="${NAVY}"/><rect width="1200" height="630" fill="url(#g)"/>${stripe}
    <text x="70" y="110" font-family="Arial Black" font-size="26" letter-spacing="5" fill="#ffffff">FAMOUS IN STEM · VOL. ${n}</text>
    ${titleLines.map((l, i) => `<text x="66" y="${205 + i * (size + 6)}" font-family="Arial Black" font-size="${size}" fill="${i === titleLines.length - 1 ? acc : '#ffffff'}">${esc(l)}</text>`).join('')}
    ${tagLines.map((l, i) => `<text x="70" y="${215 + titleLines.length * (size + 6) + 20 + i * 40}" font-family="Arial" font-weight="bold" font-size="31" fill="#d9dbe8">${esc(l)}</text>`).join('')}
    <text x="70" y="560" font-family="Arial" font-size="26" fill="#b9bdd3">By Javier Sanz · For readers 13+ · famousinstem.com</text>
  </svg>`;
  const c = await cover(n, 500);
  const meta = await sharp(c).metadata();
  const shadow = await sharp({ create: { width: meta.width + 60, height: meta.height + 60, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: Buffer.from(`<svg width="${meta.width + 60}" height="${meta.height + 60}"><rect x="30" y="38" width="${meta.width}" height="${meta.height}" rx="6" fill="black" fill-opacity="0.6"/></svg>`) }])
    .blur(18).png().toBuffer();
  await sharp(Buffer.from(svg))
    .composite([{ input: shadow, left: 1200 - meta.width - 110, top: 35 }, { input: c, left: 1200 - meta.width - 80, top: 65 }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(PUB, 'og', `${field(n, 'slug')}.jpg`));
}

async function homeOg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><radialGradient id="g" cx="0.8" cy="0.1" r="0.9"><stop offset="0" stop-color="#1d2a63"/><stop offset="0.7" stop-color="${NAVY}"/></radialGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>${stripe}
    <text x="600" y="92" text-anchor="middle" font-family="Arial Black" font-size="54" letter-spacing="8" fill="#ffffff">FAMOUS IN STEM</text>
    <text x="600" y="140" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="28" fill="#d9dbe8">True stories of the people behind science · 7 books · ages 13+</text>
  </svg>`;
  const order = [6, 4, 2, 1, 3, 5, 7];
  const layers = [];
  const w = 210, h = 336;
  for (let i = 0; i < order.length; i++) {
    const n = order[i];
    const rot = (i - 3) * 6;
    const c = await sharp(path.join(ROOT, data.volumes[n - 1].cover)).resize(w, h).png().toBuffer();
    const r = await sharp(c).rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const m = await sharp(r).metadata();
    const cx = 600 + (i - 3) * 150;
    const cy = 410 + Math.abs(i - 3) * 14;
    layers.push({ z: 10 - Math.abs(i - 3), input: r, left: Math.round(cx - m.width / 2), top: Math.round(cy - m.height / 2) });
  }
  layers.sort((a, b) => a.z - b.z);
  await sharp(Buffer.from(svg)).composite(layers.map(({ input, left, top }) => ({ input, left, top }))).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(PUB, 'og', 'home.jpg'));
}

for (const v of data.volumes) await bookOg(v);
await homeOg();
console.log('icons and social images written to public/');
