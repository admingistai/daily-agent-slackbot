import { z } from "zod";

export const dataSourceTypeSchema = z.enum([
  "linear",
  "github",
  "twitter",
  "website",
  "arxiv",
  "slack",
  "figma",
]);

export const refreshFrequencySchema = z.enum(["hourly", "daily", "weekly"]);

export const dataSourceConfigSchema = z.object({
  apiKey: z.string().optional(),
  url: z.string().url().optional(),
  refreshFrequency: refreshFrequencySchema,
});

export const dataSourceSchema = z.object({
  id: z.string(),
  type: dataSourceTypeSchema,
  name: z.string().min(1),
  config: dataSourceConfigSchema,
  enabled: z.boolean(),
  lastIngested: z.number().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const linearConfigSchema = dataSourceConfigSchema.extend({
  apiKey: z.string().min(1),
  teamId: z.string().optional(),
});

export const githubConfigSchema = dataSourceConfigSchema.extend({
  apiKey: z.string().min(1),
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export const websiteConfigSchema = dataSourceConfigSchema.extend({
  url: z.string().url(),
  crawlDepth: z.number().min(1).max(5).optional(),
  selectors: z.array(z.string()).optional(),
});

export const twitterConfigSchema = dataSourceConfigSchema.extend({
  apiKey: z.string().min(1),
  accounts: z.array(z.string()).min(1),
  keywords: z.array(z.string()).optional(),
});

export const arxivConfigSchema = dataSourceConfigSchema.extend({
  searchQuery: z.string().min(1),
  maxResults: z.number().min(1).max(100).optional(),
});
