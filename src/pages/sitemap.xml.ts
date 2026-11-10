import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { SITE, VOLUMES } from '../data/site';
import { img } from '../lib/images';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const lastmod = SITE.updated;
  const pages: { path: string; priority: string; images?: { loc: string; title: string }[] }[] = [
    { path: '/', priority: '1.0' },
    { path: '/books/', priority: '0.9' },
  ];
  for (const v of VOLUMES) {
    const cover = await getImage({ src: img(v.cover), width: 600, format: 'jpg' });
    const figs = [];
    for (const f of v.figures) {
      const fi = await getImage({ src: img(f.src), width: 1000, format: 'webp' });
      figs.push({ loc: new URL(fi.src, SITE.url).href, title: f.caption });
    }
    pages.push({ path: v.url, priority: '0.9', images: [{ loc: new URL(cover.src, SITE.url).href, title: `Cover of ${v.fullTitle}` }, ...figs] });
  }
  pages.push(
    { path: '/people/', priority: '0.8' },
    { path: '/gift-guide/', priority: '0.8' },
    { path: '/for-teachers/', priority: '0.7' },
    { path: '/about/', priority: '0.5' },
    { path: '/privacy/', priority: '0.2' },
  );
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    pages
      .map(
        (p) =>
          `  <url>\n    <loc>${SITE.url}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${p.priority}</priority>\n` +
          (p.images ?? []).map((i) => `    <image:image><image:loc>${esc(i.loc)}</image:loc><image:title>${esc(i.title)}</image:title></image:image>\n`).join('') +
          `  </url>`,
      )
      .join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
