import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new data source
export const create = mutation({
  args: {
    type: v.string(),
    name: v.string(),
    config: v.object({
      apiKey: v.optional(v.string()),
      url: v.optional(v.string()),
      refreshFrequency: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dataSources", {
      ...args,
      enabled: true,
      metadata: {},
    });
  },
});

// Get all data sources
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("dataSources").collect();
  },
});

// Get data sources by type
export const getByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("dataSources")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

// Update a data source
export const update = mutation({
  args: {
    id: v.id("dataSources"),
    enabled: v.optional(v.boolean()),
    config: v.optional(
      v.object({
        apiKey: v.optional(v.string()),
        url: v.optional(v.string()),
        refreshFrequency: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Delete a data source
export const remove = mutation({
  args: { id: v.id("dataSources") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Update last ingested timestamp
export const updateLastIngested = mutation({
  args: {
    id: v.id("dataSources"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      lastIngested: args.timestamp,
    });
  },
});
