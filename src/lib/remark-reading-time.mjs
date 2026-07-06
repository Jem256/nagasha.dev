import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export default function remarkReadingTime() {
  return (tree, file) => {
    const text = toString(tree);
    const { minutes, words } = getReadingTime(text);
    file.data.astro.frontmatter.minutesRead = Math.max(1, Math.round(minutes));
    file.data.astro.frontmatter.wordCount = words;
  };
}
