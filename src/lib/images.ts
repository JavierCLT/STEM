import type { ImageMetadata } from 'astro';

const all = import.meta.glob<{ default: ImageMetadata }>('/src/assets/{covers,figures}/*.{jpg,png}', { eager: true });

/** Resolve a repo-relative asset path from the generated data (e.g. "src/assets/covers/vol-1.jpg"). */
export function img(path: string | null | undefined): ImageMetadata {
  const key = '/' + String(path).replace(/^\/+/, '');
  const mod = all[key];
  if (!mod) throw new Error(`Missing image: ${path}`);
  return mod.default;
}
