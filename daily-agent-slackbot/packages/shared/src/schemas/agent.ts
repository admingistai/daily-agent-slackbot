import { z } from "zod";

export const agentTypeSchema = z.enum(["context", "competitive", "industry"]);

export const agentConfigSchema = z.object({
  slackChannel: z.string().min(1),
  digestSchedule: z.string(), // cron expression
  alertThresholds: z.record(z.unknown()),
});

export const agentSchema = z.object({
  id: z.string(),
  type: agentTypeSchema,
  name: z.string().min(1),
  enabled: z.boolean(),
  config: agentConfigSchema,
  lastRun: z.number().optional(),
});

export const digestContentSchema = z.object({
  agentType: agentTypeSchema,
  content: z.string(),
  blocks: z.array(z.unknown()),
  timestamp: z.number(),
  sources: z.array(z.string()).optional(),
});

export const alertEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  url: z.string().url().optional(),
  timestamp: z.number(),
  agentType: agentTypeSchema,
});
