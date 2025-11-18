import type { DigestContent, AlertEvent } from "@daily-agent/shared";

/**
 * Create a header block
 */
export function headerBlock(text: string) {
  return {
    type: "header",
    text: {
      type: "plain_text",
      text,
      emoji: true,
    },
  };
}

/**
 * Create a section block with markdown text
 */
export function sectionBlock(text: string) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
  };
}

/**
 * Create a divider block
 */
export function dividerBlock() {
  return {
    type: "divider",
  };
}

/**
 * Create a context block (for small text)
 */
export function contextBlock(text: string) {
  return {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text,
      },
    ],
  };
}

/**
 * Create a button action block
 */
export function buttonBlock(text: string, url: string) {
  return {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text,
          emoji: true,
        },
        url,
      },
    ],
  };
}

/**
 * Format a digest as Block Kit blocks
 */
export function formatDigest(digest: DigestContent): unknown[] {
  const agentEmoji = {
    context: "🏃",
    competitive: "🎯",
    industry: "📚",
  };

  const emoji = agentEmoji[digest.agentType];
  const blocks: unknown[] = [
    headerBlock(`${emoji} ${digest.agentType} Digest`),
    contextBlock(
      `Generated at <!date^${Math.floor(digest.timestamp / 1000)}^{date_short_pretty} {time}|${new Date(digest.timestamp).toLocaleString()}>`
    ),
    dividerBlock(),
    sectionBlock(digest.content),
  ];

  // Add sources if available
  if (digest.sources && digest.sources.length > 0) {
    blocks.push(dividerBlock());
    const sourceLinks = digest.sources
      .slice(0, 5)
      .map((url, i) => `<${url}|Source ${i + 1}>`)
      .join(" • ");
    blocks.push(contextBlock(`📎 Sources: ${sourceLinks}`));
  }

  return blocks;
}

/**
 * Format an alert as Block Kit blocks
 */
export function formatAlert(alert: AlertEvent): unknown[] {
  const severityEmoji = {
    low: "ℹ️",
    medium: "⚠️",
    high: "🔴",
    critical: "🚨",
  };

  const emoji = severityEmoji[alert.severity];
  const blocks: unknown[] = [
    headerBlock(`${emoji} ${alert.title}`),
    sectionBlock(alert.description),
  ];

  if (alert.url) {
    blocks.push(buttonBlock("View Details", alert.url));
  }

  blocks.push(
    contextBlock(
      `Severity: *${alert.severity.toUpperCase()}* • <!date^${Math.floor(alert.timestamp / 1000)}^{date_short_pretty} {time}|${new Date(alert.timestamp).toLocaleString()}>`
    )
  );

  return blocks;
}

/**
 * Format a simple text message with markdown
 */
export function formatSimpleMessage(title: string, content: string): unknown[] {
  return [headerBlock(title), dividerBlock(), sectionBlock(content)];
}
