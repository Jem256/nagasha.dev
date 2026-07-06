import { scaffold, argTitle } from './lib/scaffold.mjs';

await scaffold('projects', argTitle(), {
  description: '',
  status: 'active',
});
