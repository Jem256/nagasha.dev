import { parseArgs } from 'node:util';
import { scaffold } from './lib/scaffold.mjs';

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: { project: { type: 'string' } },
  allowPositionals: true,
});

await scaffold('worklog', positionals.join(' ').trim(), {
  ...(values.project ? { project: values.project } : {}),
});
