import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Log a Slack message
export const log = mutation({
  args: {
    messageId: v.string(),
    channel: v.string(),
    userId: v.optional(v.string()),
    text: v.string(),
    type: v.string(), // "digest" | "alert"
    agentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("slackMessages", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

// Get messages by channel
export const getByChannel = query({
  args: { channel: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("slackMessages")
      .withIndex("by_channel", (q) => q.eq("channel", args.channel))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// Get messages by type
export const getByType = query({
  args: { type: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("slackMessages")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// Add feedback to a message
export const addFeedback = mutation({
  args: {
    id: v.id("slackMessages"),
    feedback: v.string(), // "thumbs_up" | "thumbs_down"
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      feedback: args.feedback,
    });
  },
});

// Get recent messages
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("slackMessages")
      .order("desc")
      .take(args.limit ?? 20);
  },
});
