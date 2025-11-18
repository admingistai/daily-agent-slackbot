#!/usr/bin/env bun
/**
 * Test script to verify Slack integration
 *
 * Usage:
 *   bun run scripts/test-slack.ts [channel-id]
 *
 * Example:
 *   bun run scripts/test-slack.ts C123ABC456
 */

import { SlackClient, formatDigest } from "../packages/slack/src";
import type { DigestContent } from "../packages/shared/src";

async function main() {
  // Get environment variables
  const token = process.env.SLACK_BOT_TOKEN;
  const defaultChannel = process.env.SLACK_TEST_CHANNEL || "C123ABC456";

  // Get channel from args or use default
  const channel = process.argv[2] || defaultChannel;

  if (!token) {
    console.error("❌ Error: SLACK_BOT_TOKEN not found in environment");
    console.log("\nPlease set it in your .env file:");
    console.log("  SLACK_BOT_TOKEN=xoxb-your-token-here\n");
    process.exit(1);
  }

  console.log("🚀 Testing Slack integration...");
  console.log(`📱 Channel: ${channel}`);
  console.log("");

  // Create Slack client
  const slack = new SlackClient(token);

  try {
    // Test 1: Simple text message
    console.log("Test 1: Posting simple text message...");
    const result1 = await slack.postText(
      channel,
      "👋 Hello from Daily Agent Bot! This is a test message."
    );
    console.log("✅ Simple message posted successfully");
    console.log(`   Message ID: ${result1.ts}`);
    console.log("");

    // Wait a second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 2: Context Agent Digest
    console.log("Test 2: Posting Context Agent digest...");
    const contextDigest: DigestContent = {
      agentType: "context",
      content: `
*In Progress:*
• Daily Agent Slackbot setup (@you) - Testing Slack integration ✨

*Next Steps:*
• Configure Convex deployment
• Add data sources
• Set up digest scheduling

*Working Great:*
• Slack posting is functional! 🎉
      `.trim(),
      blocks: [],
      timestamp: Date.now(),
    };
    contextDigest.blocks = formatDigest(contextDigest);

    const result2 = await slack.postBlocks(
      channel,
      "Context Agent Digest",
      contextDigest.blocks
    );
    console.log("✅ Context digest posted successfully");
    console.log(`   Message ID: ${result2.ts}`);
    console.log("");

    // Wait a second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 3: Competitive Agent Digest
    console.log("Test 3: Posting Competitive Agent digest...");
    const competitiveDigest: DigestContent = {
      agentType: "competitive",
      content: `
*Test Competitors:*
• Competitor A - Launched new AI feature
  → Early testing phase
  → Positive HN feedback
• Competitor B - Raised funding
  → $5M seed round
  → Targeting enterprise
      `.trim(),
      blocks: [],
      timestamp: Date.now(),
    };
    competitiveDigest.blocks = formatDigest(competitiveDigest);

    const result3 = await slack.postBlocks(
      channel,
      "Competitive Agent Digest",
      competitiveDigest.blocks
    );
    console.log("✅ Competitive digest posted successfully");
    console.log(`   Message ID: ${result3.ts}`);
    console.log("");

    // Wait a second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test 4: Industry Agent Digest
    console.log("Test 4: Posting Industry Agent digest...");
    const industryDigest: DigestContent = {
      agentType: "industry",
      content: `
*Test Research:*
• New paper: "AI Agent Architectures"
  → Multi-agent coordination patterns
  → Performance benchmarks
• Trending: LLM optimization techniques
  → Token efficiency improvements
      `.trim(),
      blocks: [],
      timestamp: Date.now(),
    };
    industryDigest.blocks = formatDigest(industryDigest);

    const result4 = await slack.postBlocks(
      channel,
      "Industry Agent Digest",
      industryDigest.blocks
    );
    console.log("✅ Industry digest posted successfully");
    console.log(`   Message ID: ${result4.ts}`);
    console.log("");

    console.log("🎉 All tests passed!");
    console.log("");
    console.log("Check your Slack channel to see the messages:");
    console.log(`https://slack.com/app_redirect?channel=${channel}`);

  } catch (error: any) {
    console.error("❌ Error posting to Slack:");
    console.error(error.message);

    if (error.data) {
      console.error("\nSlack API Response:", error.data);
    }

    console.log("\nTroubleshooting tips:");
    console.log("1. Make sure your SLACK_BOT_TOKEN is correct");
    console.log("2. Verify the channel ID is correct");
    console.log("3. Check that your bot has 'chat:write.public' scope");
    console.log("4. Or manually invite the bot to the channel: /invite @Daily Agent Bot");

    process.exit(1);
  }
}

main();
