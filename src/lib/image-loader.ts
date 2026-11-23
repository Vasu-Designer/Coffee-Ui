'use client';

/**
 * Global next/image loader. All photography is served from the Unsplash
 * (imgix) CDN, which resizes, crops and negotiates AVIF/WebP at the edge,
 * so we skip the Next.js optimiser round-trip entirely.
 *
 * `src` may be a bare Unsplash id ("photo-123-abc"), a full URL or a local path.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith('/')) return src;
  const base = src.startsWith('http') ? src.split('?')[0] : `https://images.unsplash.com/${src}`;
  const params = new URLSearchParams({
    w: String(width),
    q: String(quality ?? 64),
    auto: 'format',
    fit: 'crop',
    crop: 'entropy',
  });
  return `${base}?${params.toString()}`;
}
