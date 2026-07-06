import { visit } from 'unist-util-visit';

export default function remarkMermaidFlag() {
  return (tree, file) => {
    let found = false;
    visit(tree, 'code', (node) => {
      if (node.lang === 'mermaid') found = true;
    });
    file.data.astro.frontmatter.hasMermaid = found;
  };
}
