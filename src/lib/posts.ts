import { getCollection, type CollectionEntry } from 'astro:content';

type PostEntry = CollectionEntry<'posts'>;

function parsePostId(id: string) {
  const normalized = id.replace(/\.md$/, '');
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);

  if (!match) {
    throw new Error(`Post filename "${id}" does not match YYYY-MM-DD-slug format.`);
  }

  const [, year, month, day, slug] = match;

  return {
    year,
    month,
    day,
    slug,
    date: new Date(`${year}-${month}-${day}T00:00:00Z`),
  };
}

export function getPostUrl(post: PostEntry) {
  const { year, month, day, slug } = parsePostId(post.id);
  return `/${year}/${month}/${day}/${slug}.html`;
}

export function normalizePost(post: PostEntry) {
  const parsed = parsePostId(post.id);

  return {
    ...parsed,
    title: post.data.title,
    tags: post.data.tags ?? [],
    published: post.data.published !== false,
    post,
  };
}

export async function getPublishedPosts() {
  const posts = await getCollection('posts', ({ data }) => data.published !== false);

  return posts
    .map((post) => normalizePost(post))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
