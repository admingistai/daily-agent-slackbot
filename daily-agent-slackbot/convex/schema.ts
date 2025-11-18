import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Data Source Configuration
  dataSources: defineTable({
    type: v.string(), // "linear" | "github" | "twitter" | "website" | "arxiv"
    name: v.string(),
    config: v.object({
      apiKey: v.optional(v.string()),
      url: v.optional(v.string()),
      refreshFrequency: v.string(), // "hourly" | "daily"
    }),
    enabled: v.boolean(),
    lastIngested: v.optional(v.number()),
    metadata: v.optional(v.any()),
  }).index("by_type", ["type"]),

  // Agent Configuration
  agents: defineTable({
    type: v.string(), // "context" | "competitive" | "industry"
    name: v.string(),
    enabled: v.boolean(),
    config: v.object({
      slackChannel: v.string(),
      digestSchedule: v.string(), // cron expression
      alertThresholds: v.any(),
    }),
    lastRun: v.optional(v.number()),
  }).index("by_type", ["type"]),

  // Knowledge Base (chunked documents)
  knowledge: defineTable({
    sourceId: v.id("dataSources"),
    sourceType: v.string(),
    content: v.string(),
    metadata: v.object({
      title: v.optional(v.string()),
      url: v.optional(v.string()),
      timestamp: v.number(),
      author: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    }),
    embedding: v.optional(v.array(v.number())),
    agentType: v.string(), // "context" | "competitive" | "industry"
  })
    .index("by_source", ["sourceId"])
    .index("by_agent", ["agentType"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536, // OpenAI ada-002
      filterFields: ["sourceType", "agentType"],
    }),

  // Slack Messages Log
  slackMessages: defineTable({
    messageId: v.string(),
    channel: v.string(),
    userId: v.optional(v.string()),
    text: v.string(),
    timestamp: v.number(),
    type: v.string(), // "digest" | "alert"
    agentType: v.optional(v.string()),
    feedback: v.optional(v.string()), // "thumbs_up" | "thumbs_down"
  })
    .index("by_channel", ["channel"])
    .index("by_type", ["type"]),

  // Ingestion Jobs
  ingestionJobs: defineTable({
    dataSourceId: v.id("dataSources"),
    status: v.string(), // "pending" | "running" | "completed" | "failed"
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    itemsProcessed: v.number(),
    errors: v.optional(v.array(v.string())),
  })
    .index("by_status", ["status"])
    .index("by_source", ["dataSourceId"]),
});
