import type { AgentType, DigestContent } from "@daily-agent/shared";
import { SlackClient, formatDigest } from "@daily-agent/slack";

/**
 * Generate a daily digest for the specified agent type
 *
 * This function:
 * 1. Queries Convex for recent knowledge
 * 2. Generates a summary (mock for now)
 * 3. Formats with Block Kit
 * 4. Posts to Slack
 */
export async function generateDigest(agentType: AgentType): Promise<DigestContent> {
  // TODO: Query Convex for recent knowledge
  // const recentDocs = await convex.query(api.knowledge.getRecentByAgent, {
  //   agentType,
  //   since: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
  // });

  // TODO: Generate summary using AI
  // For now, return mock data
  const mockContent = getMockDigestContent(agentType);

  const digest: DigestContent = {
    agentType,
    content: mockContent,
    blocks: formatDigest({
      agentType,
      content: mockContent,
      blocks: [],
      timestamp: Date.now(),
    }),
    timestamp: Date.now(),
  };

  return digest;
}

/**
 * Post a digest to Slack
 */
export async function postDigestToSlack(
  digest: DigestContent,
  channel: string,
  slackToken: string
): Promise<void> {
  const slack = new SlackClient(slackToken);

  await slack.postBlocks(
    channel,
    digest.content.substring(0, 100), // Fallback text
    digest.blocks
  );
}

/**
 * Get mock digest content for testing
 */
function getMockDigestContent(agentType: AgentType): string {
  const mockContent = {
    context: `
*In Progress:*
• Onboarding widget v2 (@alice) - PR #234 ready for review
• TikTok ingestion (@bob) - Blocked on API rate limits

*Shipped Yesterday:*
• Dashboard analytics - merged to main

*Needs Attention:*
• Design review for search widget - 2 days old
• 3 PRs waiting >24hrs
    `.trim(),

    competitive: `
*[Competitor A]:*
• Launched AI Overview tool (blog post)
  → Pricing: $299/mo, focuses on E-E-A-T
  → HN: 234 points, mostly positive
• CEO in TechCrunch: targeting enterprise
• Hiring 2x ML engineers

*[Competitor B]:*
• Website update: new case studies
• Twitter: "big announcement next week" (243 likes)
    `.trim(),

    industry: `
*New Papers:*
• "Optimizing LLM Responses for Search Visibility"
  → Framework for measuring GEO effectiveness
  → Key: Structured data boosts citation by 34%

*Trending:*
• HN: "Google AI Overviews now cite sources" (412pts)
  → Transparency becoming table stakes
• @sama on agentic workflows (10K+ likes)

*New Tools:*
• LangGraph 0.3 - improved streaming
    `.trim(),
  };

  return mockContent[agentType];
}
