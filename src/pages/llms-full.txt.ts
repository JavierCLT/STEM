import type { APIRoute } from 'astro';
import { SITE, VOLUMES, TOTALS, SERIES_FAQ, amazonUrl } from '../data/site';

// Everything an assistant needs to describe or recommend a book, in one plain-text file.
export const GET: APIRoute = () => {
  const out: string[] = [
    `# ${SITE.name}: full book information`,
    '',
    `${SITE.name} is a series of seven nonfiction books by ${SITE.author}. Each book tells the true stories of 20 to 27 people from one field of science, technology, engineering or math, in short chapters written for readers 13 and up. ${TOTALS.people} people in ${TOTALS.chapters} chapters across the series. Every volume and every chapter stands on its own. Website: ${SITE.url}. Amazon series page: ${SITE.seriesPage}.`,
    '',
  ];
  for (const v of VOLUMES) {
    out.push(
      `## ${v.fullTitle}`,
      '',
      `Tagline: ${v.tagline}.`,
      `Field: ${v.field}. Chapters: ${v.chapters}. People: ${v.peopleCount}. Audience: readers 13 and up. Best for readers interested in: ${v.interest.toLowerCase()}.`,
      `Web page: ${SITE.url}${v.url}`,
      `Amazon paperback: ${amazonUrl(v.asin.paperback!)}${v.asin.kindle ? `\nAmazon Kindle: ${amazonUrl(v.asin.kindle)}` : ''}`,
      '',
      ...v.pitch,
      '',
      'Who is in the book (chapter title and the big idea, as printed):',
      '',
      ...v.people.map((p) => `- ${p.name} (${p.lifespan}). ${p.subtitle}. Big idea: ${p.bigIdea}`),
      '',
      ...v.faq.map((f) => `Q: ${f.q}\nA: ${f.a}\n`),
    );
  }
  out.push('## About the series', '', ...SERIES_FAQ.map((f) => `Q: ${f.q}\nA: ${f.a}\n`));
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
