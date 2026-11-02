import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        type: z.enum(['article', 'note', 'talk']).default('article'),
        series: reference('series').optional(),
        seriesPart: z.number().int().positive().optional(),
        tags: z.array(z.string().min(1)).default([]),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        cover: image().optional(),
      })
      .refine((data) => !data.series || data.seriesPart !== undefined, {
        message: 'seriesPart is required when series is set',
        path: ['seriesPart'],
      })
      .refine((data) => data.series || data.seriesPart === undefined, {
        message: 'seriesPart is set but series is missing',
        path: ['series'],
      }),
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/series' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        summary: z.string().min(1),
        intro: z.string().optional(),
        plannedParts: z.number().int().positive(),
        parts: z.array(
          z.object({
            part: z.number().int().positive(),
            title: z.string().min(1),
            summary: z.string().min(1),
          }),
        ),
        featured: z.boolean().default(false),
        project: reference('projects').optional(),
        diagram: image().optional(),
        diagramCaption: z.string().optional(),
      })
      .refine((data) => data.parts.length === data.plannedParts, {
        message: 'parts must list exactly plannedParts entries',
        path: ['parts'],
      })
      .refine((data) => data.parts.every((p, i) => p.part === i + 1), {
        message: 'parts must be numbered 1..plannedParts in order',
        path: ['parts'],
      }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    repoUrl: z.url(),
    features: z.array(z.string().min(1)).default([]),
    quickStart: z.string().min(1),
    featured: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    eyebrow: z.string().optional(),
    tagline: z.string().optional(),
    lead: z.string().optional(),
    primaryCta: z.string().optional(),
    secondaryCta: z.string().optional(),
    homeTitle: z.string().optional(),
    homeSummary: z.string().optional(),
    focusTitle: z.string().optional(),
    focusAreas: z.array(z.string()).default([]),
  }),
});

export const collections = { articles, series, projects, pages };
