import type { TaggableCollection } from './collections';

const LINKABLE_COLLECTIONS: Record<TaggableCollection, string> = {
  blog: '/blog/',
  notes: '/notes/',
  lists: '/lists/',
  projects: '/projects/',
};

const LABELS: Record<TaggableCollection, string> = {
  blog: 'Blog',
  notes: 'Notes',
  lists: 'List',
  projects: 'Project',
};

export function collectionLabel(collection: TaggableCollection): string {
  return LABELS[collection] ?? collection;
}

export function entryUrl(collection: TaggableCollection, id: string): string {
  return `${LINKABLE_COLLECTIONS[collection]}${id}/`;
}
