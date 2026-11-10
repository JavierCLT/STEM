// schema.org JSON-LD builders. Every node has a stable @id so pages can reference each other.
import { SITE, VOLUMES, amazonUrl, type Volume } from '../data/site';
import wiki from '../data/wikipedia.json';

const abs = (path: string) => new URL(path, SITE.url).href;
export const ID = {
  website: abs('/#website'),
  author: abs('/#author'),
  series: abs('/#series'),
  book: (v: Volume) => abs(`${v.url}#book`),
};

const wikiFor = (name: string): string | undefined => (wiki as Record<string, string>)[name];

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: abs('/'),
    name: SITE.name,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': ID.author },
  };
}

export function authorNode() {
  return {
    '@type': 'Person',
    '@id': ID.author,
    name: SITE.author,
    url: abs('/about/'),
    jobTitle: 'Author',
    description: 'Author of the Famous in STEM series and of other nonfiction books, including 500 Careers and Salaries and 200 Jobs Explained.',
    sameAs: [SITE.authorStore],
  };
}

export function seriesNode(image?: string) {
  return {
    '@type': 'BookSeries',
    '@id': ID.series,
    name: SITE.name,
    url: abs('/books/'),
    description:
      'Seven books of short, true biographies of the people behind science, technology, engineering and math: physicists, mathematicians, computing pioneers, chemists, biologists, medical pioneers and engineers. For readers 13 and up.',
    author: { '@id': ID.author },
    inLanguage: 'en',
    genre: ['Biography', 'History of science', 'Young adult nonfiction'],
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 13 },
    ...(image ? { image } : {}),
    sameAs: [SITE.seriesPage],
    hasPart: VOLUMES.map((v) => ({ '@id': ID.book(v) })),
  };
}

function personNodes(v: Volume) {
  return v.people.flatMap((p) =>
    p.people.map((name) => {
      const sameAs = wikiFor(name);
      return { '@type': 'Person', name, ...(sameAs ? { sameAs } : {}) };
    }),
  );
}

export function bookNode(v: Volume, coverUrl?: string) {
  const editions = (['paperback', 'kindle', 'hardcover'] as const)
    .filter((f) => v.asin[f])
    .map((f) => ({
      '@type': 'Book',
      bookFormat: f === 'kindle' ? 'https://schema.org/EBook' : f === 'hardcover' ? 'https://schema.org/Hardcover' : 'https://schema.org/Paperback',
      name: v.fullTitle,
      inLanguage: 'en',
      url: amazonUrl(v.asin[f]!),
      identifier: { '@type': 'PropertyValue', propertyID: 'ASIN', value: v.asin[f] },
    }));
  return {
    '@type': 'Book',
    '@id': ID.book(v),
    name: v.title,
    alternateName: v.fullTitle,
    url: abs(v.url),
    description: `${v.tagline}. ${v.hook}`,
    author: { '@id': ID.author },
    copyrightHolder: { '@id': ID.author },
    copyrightYear: 2026,
    bookEdition: '2026 edition',
    inLanguage: 'en',
    genre: ['Biography', 'History of science', `History of ${v.field.toLowerCase()}`],
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 13 },
    isPartOf: { '@id': ID.series },
    position: v.n,
    ...(coverUrl ? { image: coverUrl } : {}),
    about: personNodes(v),
    workExample: editions,
  };
}

export function breadcrumbNode(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.url) })),
  };
}

export function faqNode(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
  };
}

export function webPageNode(path: string, name: string, description: string, extra: Record<string, unknown> = {}) {
  return {
    '@type': 'WebPage',
    '@id': abs(path) + '#webpage',
    url: abs(path),
    name,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': ID.website },
    dateModified: SITE.updated,
    ...extra,
  };
}

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
