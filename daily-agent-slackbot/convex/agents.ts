import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new agent
export const create = mutation({
  args: {
    type: v.string(),
    name: v.string(),
    config: v.object({
      slackChannel: v.string(),
      digestSchedule: v.string(),
      alertThresholds: v.any(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", {
      ...args,
      enabled: true,
    });
  },
});

// Get all agents
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

// Get enabled agents
export const getEnabled = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("enabled"), true))
      .collect();
  },
});

// Get agent by type
export const getByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agents")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .first();
  },
});

// Update an agent
export const update = mutation({
  args: {
    id: v.id("agents"),
    enabled: v.optional(v.boolean()),
    config: v.optional(
      v.object({
        slackChannel: v.string(),
        digestSchedule: v.string(),
        alertThresholds: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Update last run timestamp
export const updateLastRun = mutation({
  args: {
    id: v.id("agents"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      lastRun: args.timestamp,
    });
  },
});

// Delete an agent
export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
