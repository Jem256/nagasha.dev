import type { TaggableCollection } from './collections';

const LINKABLE_COLLECTIONS: Record<TaggableCollection, string> = {
  blog: '/blog/',
  til: '/til/',
  worklog: '/worklog/',
  notes: '/notes/',
  lists: '/lists/',
  projects: '/projects/',
};

const LABELS: Record<TaggableCollection, string> = {
  blog: 'Blog',
  til: 'TIL',
  worklog: 'Work Log',
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
