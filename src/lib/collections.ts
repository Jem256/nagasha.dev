/** Collections that share the base title/date/tags/draft shape and have per-entry pages. */
export type TaggableCollection = 'blog' | 'til' | 'worklog' | 'notes' | 'lists' | 'projects';

export const TAGGABLE_COLLECTIONS: TaggableCollection[] = ['blog', 'til', 'worklog', 'notes', 'lists', 'projects'];
