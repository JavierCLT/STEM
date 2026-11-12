# famousinstem.com

The website for **Famous in STEM**, a seven-book series of short, true biographies of scientists, mathematicians, inventors, doctors and engineers by Javier Sanz. The site exists to help readers find the books: every page leads to Amazon.

Built with [Astro](https://astro.build) 7 as a fully static site (no client framework; a few lines of inline JavaScript for the people filter and local Amazon stores). Hosted on GitHub Pages at the custom domain famousinstem.com.

## Pages

| Path | What it is |
|---|---|
| `/` | Home: the seven covers, books, first lines, a sample chapter, activities, a book chooser, FAQ |
| `/books/` | The seven books compared |
| `/books/<slug>/` | One page per book: who is inside, the opening of one chapter, an illustration, activities, first lines, FAQ |
| `/people/` | All 161 people with dates and big idea, searchable and filterable |
| `/reading-list/` | Science books for teens by subject (other authors' books, facts in `src/data/reading.ts`) |
| `/what-to-read-after-who-was/` | Next steps for readers who have outgrown the Who Was? books |
| `/printables/` | Free PDFs: biography project worksheet, women in STEM timeline poster |
| `/press/` | Media kit: descriptions, facts, cover downloads, contact |
| `/gift-guide/`, `/for-teachers/`, `/about/`, `/privacy/` | Supporting pages |
| `/llms.txt`, `/llms-full.txt`, `/books.json` | Plain-text and JSON summaries for AI assistants and agents |
| `/sitemap.xml`, `/robots.txt` | Crawling (all crawlers, including AI search crawlers, are allowed) |

## How the content works

- `src/data/site.ts`: everything written for the site (pitches, FAQs, colors, ASINs). Edit here to change copy or links.
- `src/data/generated/volumes.json`: what the site shows from the books (names, chapter subtitles, big ideas, years, and the chosen excerpts). Generated, do not edit by hand.
- `scripts/excerpt-picks.json`: which excerpts each book page shows (chapter opening, activity boxes, first lines, figure).
- `src/assets/covers`, `src/assets/figures`: image masters; the build makes AVIF/WebP sizes.

Only the excerpts listed in `excerpt-picks.json` leave the manuscripts. The full chapters are never in this repository.

### The KDP Select 10% rule

Kindle editions in KDP Select may be shown elsewhere only up to 10% of the book. Two checks keep the site well under that:

1. `npm run content` reports the share of each book it copies (about 5–7%).
2. `npm run check:excerpts` (after a build) scans everything the site publishes for sentences from each manuscript and fails above 10% (warns above 8%). Last run: 4.9% to 6.3% of each book's text and one illustration per book.

## Commands

Requires Node 22.23 or newer (24 LTS recommended).

```bash
npm ci                  # install
npm run dev             # local dev server at http://localhost:4321
npm run build           # build to dist/ and run the link/SEO checks in scripts/postbuild.mjs
npm run preview         # serve dist/
```

Content and images (run locally; they need the manuscripts and cover files):

```bash
npm run content                    # rebuild src/data/generated/volumes.json and image masters
node scripts/make-images.mjs       # favicons and social images (uses Arial Black, as on the covers)
node scripts/wikipedia-links.mjs   # schema.org sameAs links for every person, checked by birth year
node scripts/make-printables.mjs   # the two printable PDFs + previews (needs Chrome or Edge)
npm run check:excerpts             # the 10% audit, after npm run build
node scripts/indexnow.mjs          # after a deploy: tell Bing/IndexNow the pages changed
```

The source folders for `npm run content` come from `.local/paths.json` (not committed):

```json
{ "bookSrc": "<folder with Vol1..Vol7, figures, figures-ai>", "coverSrc": "<folder with the Kindle front-cover JPGs>" }
```

## Deploying

Every push to `main` builds and deploys through `.github/workflows/deploy.yml` (GitHub Pages, source: GitHub Actions). DNS for famousinstem.com points at GitHub Pages:

- `A` records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `AAAA` records for `@`: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
- `CNAME` for `www`: javierclt.github.io

## Changing a store link

ASINs live in `VOLUME_COPY` in `src/data/site.ts` (`asin: { paperback, kindle, hardcover }`). Add a `kindle` or `hardcover` ASIN there and the buttons, structured data, llms.txt and books.json pick it up.

## Other authors' books

`src/data/reading.ts` holds every outside book on the reading list and the Who Was? page, with a source URL for its ages and awards. Recheck them about once a year (ages and titles change between editions) and update `CHECKED`.
