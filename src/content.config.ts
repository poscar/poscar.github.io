import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
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
