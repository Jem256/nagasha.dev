interface Dated {
  data: { date: Date; draft?: boolean };
}

export function byDateDesc<T extends Dated>(entries: T[]): T[] {
  return [...entries].sort((a, b) => +b.data.date - +a.data.date);
}

export function published<T extends Dated>(entries: T[]): T[] {
  return entries.filter((e) => !e.data.draft || import.meta.env.DEV);
}
