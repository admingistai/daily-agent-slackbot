import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create an ingestion job
export const create = mutation({
  args: {
    dataSourceId: v.id("dataSources"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ingestionJobs", {
      dataSourceId: args.dataSourceId,
      status: "pending",
      startedAt: Date.now(),
      itemsProcessed: 0,
    });
  },
});

// Update job status
export const updateStatus = mutation({
  args: {
    id: v.id("ingestionJobs"),
    status: v.string(),
    itemsProcessed: v.optional(v.number()),
    errors: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const completedAt = args.status === "completed" || args.status === "failed"
      ? Date.now()
      : undefined;

    return await ctx.db.patch(id, {
      ...updates,
      ...(completedAt && { completedAt }),
    });
  },
});

// Get jobs by status
export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingestionJobs")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get jobs by data source
export const getBySource = query({
  args: { dataSourceId: v.id("dataSources") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingestionJobs")
      .withIndex("by_source", (q) => q.eq("dataSourceId", args.dataSourceId))
      .order("desc")
      .collect();
  },
});

// Get recent jobs
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingestionJobs")
      .order("desc")
      .take(args.limit ?? 20);
  },
});
