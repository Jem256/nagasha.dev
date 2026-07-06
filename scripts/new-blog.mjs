import { scaffold, argTitle } from './lib/scaffold.mjs';

await scaffold('blog', argTitle(), {
  description: '',
  featured: false,
});
