import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add knowledge entry
export const add = mutation({
  args: {
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
    agentType: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("knowledge", args);
  },
});

// Get recent knowledge by agent type
export const getRecentByAgent = query({
  args: {
    agentType: v.string(),
    since: v.number(), // timestamp
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("knowledge")
      .withIndex("by_agent", (q) => q.eq("agentType", args.agentType))
      .filter((q) => q.gte(q.field("metadata.timestamp"), args.since))
      .order("desc")
      .take(args.limit ?? 50);

    return results;
  },
});

// Search knowledge (vector search placeholder)
export const search = query({
  args: {
    agentType: v.string(),
    embedding: v.array(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Vector search using the by_embedding index
    const results = await ctx.db
      .query("knowledge")
      .withIndex("by_embedding", (q) =>
        q.eq("agentType", args.agentType)
      )
      .take(args.limit ?? 10);

    return results;
  },
});

// Get knowledge by source
export const getBySource = query({
  args: { sourceId: v.id("dataSources") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("knowledge")
      .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId))
      .collect();
  },
});

// Delete knowledge entry
export const remove = mutation({
  args: { id: v.id("knowledge") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Delete all knowledge from a source
export const removeBySource = mutation({
  args: { sourceId: v.id("dataSources") },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("knowledge")
      .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId))
      .collect();

    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }

    return { deleted: entries.length };
  },
});
