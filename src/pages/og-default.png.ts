import type { APIRoute } from 'astro';
import { renderOgImage } from '../lib/og-image';

export const GET: APIRoute = () => {
  const png = renderOgImage({ title: 'Jemimah — Bitcoin & Lightning open source', kicker: 'nagasha.dev' });
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
