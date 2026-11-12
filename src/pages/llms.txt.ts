import type { APIRoute } from 'astro';
import { SITE, VOLUMES, TOTALS, SERIES_FAQ, amazonUrl } from '../data/site';

// https://llmstxt.org: a short, plain map of the site for language models and AI assistants.
export const GET: APIRoute = () => {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.name} is a series of seven nonfiction books by ${SITE.author}: short, true biographies of the people behind science, technology, engineering and math, written for readers 13 and up. ${TOTALS.people} people in ${TOTALS.chapters} chapters. Every volume stands on its own. Sold on Amazon in paperback and Kindle editions.`,
    '',
    'Key facts:',
    `- Author: ${SITE.author} (Amazon author page: ${SITE.authorStore})`,
    `- Series page on Amazon: ${SITE.seriesPage}`,
    '- Audience: readers 13 and up (teens, curious adults, students, teachers, homeschool families)',
    '- Format of each chapter: a fact box (dates and the big idea), a true opening scene, one scientific idea explained in plain language, and usually a "Try this", "Look around you" or "Think about it" box',
    '- Editions: 2026 editions, rewritten and fact-checked chapter by chapter; the books can be read in any order',
    '',
    '## The seven books',
    '',
    ...VOLUMES.map(
      (v) =>
        `- [${v.fullTitle}](${SITE.url}${v.url}): ${v.tagline}. ${v.hook} People: ${v.people.map((p) => p.name).join(', ')}. Paperback on Amazon: ${amazonUrl(v.asin.paperback!)}${v.asin.kindle ? `; Kindle: ${amazonUrl(v.asin.kindle)}` : ''}`,
    ),
    '',
    '## Pages',
    '',
    `- [All ${TOTALS.people} people, with dates and big ideas](${SITE.url}/people/): searchable index of everyone in the series`,
    `- [Compare the seven books](${SITE.url}/books/)`,
    `- [Gift guide](${SITE.url}/gift-guide/): which book suits which interest`,
    `- [For teachers and homeschool](${SITE.url}/for-teachers/): biography projects, activities, discussion questions`,
    `- [Science books for teens: a reading list by subject](${SITE.url}/reading-list/): recommended science reading for ages 13+, including books by other authors`,
    `- [What to read after the Who Was? books](${SITE.url}/what-to-read-after-who-was/): next steps for readers who have outgrown the Who Was? biographies`,
    `- [Free printables](${SITE.url}/printables/): STEM biography project worksheet and a women in STEM timeline poster (PDF)`,
    `- [Media kit](${SITE.url}/press/): descriptions, facts, cover downloads, author bio, contact (${SITE.email})`,
    `- [About the series and author](${SITE.url}/about/)`,
    '',
    '## Frequently asked',
    '',
    ...SERIES_FAQ.map((f) => `- ${f.q} ${f.a}`),
    '',
    '## Optional',
    '',
    `- [Full plain-text version of this site's book information](${SITE.url}/llms-full.txt)`,
    `- [Machine-readable catalog (JSON)](${SITE.url}/books.json)`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
