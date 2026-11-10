import type { APIRoute } from 'astro';
import { SITE, VOLUMES, amazonUrl } from '../data/site';

// A small machine-readable catalog for agents and integrations.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        series: SITE.name,
        author: SITE.author,
        url: SITE.url,
        amazonSeries: SITE.seriesPage,
        audience: 'Readers 13 and up',
        updated: SITE.updated,
        books: VOLUMES.map((v) => ({
          volume: v.n,
          title: v.title,
          fullTitle: v.fullTitle,
          field: v.field,
          tagline: v.tagline,
          url: `${SITE.url}${v.url}`,
          chapters: v.chapters,
          people: v.people.map((p) => ({ name: p.name, lived: p.lifespan, bigIdea: p.bigIdea })),
          buy: Object.fromEntries(Object.entries(v.asin).map(([f, a]) => [f, amazonUrl(a!)])),
        })),
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
