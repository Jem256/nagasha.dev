export const TAGS = [
    'bitcoin',
    'lightning',
    'polar',
    'lnd',
    'cln',
    'ldk',
    'linux',
    'docker',
    'typescript',
    'bitdevs',
    'btrust',
    'career',
    'books',
    'reading',
] as const;

export type Tag = (typeof TAGS)[number];

export const TAG_LABELS: Record<Tag, string> = {
    bitcoin: 'Bitcoin',
    lightning: 'Lightning',
    polar: 'Polar',
    lnd: 'LND',
    cln: 'Core Lightning',
    ldk: 'LDK',
    linux: 'Linux',
    docker: 'Docker',
    typescript: 'TypeScript',
    bitdevs: 'BitDevs',
    btrust: 'Btrust',
    career: 'Career',
    books: 'Books',
    reading: 'Reading',
};
