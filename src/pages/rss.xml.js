import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

export async function GET(context) {
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft);
  const container = await AstroContainer.create();

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const content = await container.renderToString(Content);
      return {
        title: post.data.title,
        description: post.data.description ?? '',
        pubDate: post.data.date,
        link: `/blog/${post.id}/`,
        content,
      };
    }),
  );

  return rss({
    title: "Jemimah's blog",
    description: 'Bitcoin, Lightning, and open source, written in Kampala.',
    site: context.site,
    items,
  });
}
