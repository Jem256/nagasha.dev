import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage } from '../../../lib/og-image';
import { collectionLabel } from '../../../lib/urls';
import { TAGGABLE_COLLECTIONS, type TaggableCollection } from '../../../lib/collections';

const OG_COLLECTIONS = TAGGABLE_COLLECTIONS;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [];
  for (const collection of OG_COLLECTIONS) {
    const entries = await getCollection(collection);
    for (const entry of entries) {
      paths.push({ params: { collection, id: entry.id }, props: { title: entry.data.title } });
    }
  }
  return paths;
};

export const GET: APIRoute = async ({ params, props }) => {
  const png = renderOgImage({
    title: props.title as string,
    kicker: collectionLabel(params.collection as TaggableCollection),
  });

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
