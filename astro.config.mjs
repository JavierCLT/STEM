// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://famousinstem.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // One request per page: the whole stylesheet ships inside the HTML.
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  vite: {
    // Inline (empty) PostCSS config so Vite never picks up a config from a parent folder.
    css: { postcss: { plugins: [] } },
  },
  image: {
    responsiveStyles: true,
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Archivo',
      cssVariable: '--font-archivo',
      fallbacks: ['Arial', 'Helvetica', 'sans-serif'],
      // Preloaded and swapped in: brand type on the first visit; metric-matched fallback keeps the shift small.
      display: 'swap',
      options: {
        variants: [
          {
            src: ['./node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
  ],
});
