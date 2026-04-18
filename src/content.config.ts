import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
    status: z.string().optional(),
    type: z.string().optional(),
    meta: z.record(z.string(), z.any()).optional(),
    layout: z.string().optional(),
  }),
});

export const collections = { posts };
