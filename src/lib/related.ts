import { getCollection, type CollectionEntry } from 'astro:content';
import type { TaggableCollection } from './collections';

function scoreByTags(tags: readonly string[], candidateTags: readonly string[] = []): number {
  return candidateTags.filter((t) => tags.includes(t)).length;
}

/** Finds entries across one or more collections that share tags with `tags`, ranked by overlap count. */
export async function getRelatedEntries<C extends TaggableCollection>(
  collections: C[],
  tags: readonly string[],
  excludeId: string,
  limit = 4,
): Promise<Array<{ collection: C; entry: CollectionEntry<C> }>> {
  if (tags.length === 0) return [];

  const results: Array<{ collection: C; entry: CollectionEntry<C>; score: number }> = [];

  for (const collection of collections) {
    const entries = await getCollection(collection);
    for (const entry of entries) {
      if (entry.data.draft) continue;
      if (entry.id === excludeId) continue;
      const score = scoreByTags(tags, entry.data.tags ?? []);
      if (score > 0) results.push({ collection, entry, score });
    }
  }

  results.sort((a, b) => b.score - a.score || +b.entry.data.date - +a.entry.data.date);
  return results.slice(0, limit).map(({ collection, entry }) => ({ collection, entry }));
}
