export type AgentType = "context" | "competitive" | "industry";

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  enabled: boolean;
  config: AgentConfig;
  lastRun?: number;
}

export interface AgentConfig {
  slackChannel: string;
  digestSchedule: string; // cron expression
  alertThresholds: Record<string, unknown>;
}

export interface DigestContent {
  agentType: AgentType;
  content: string;
  blocks: unknown[]; // Slack Block Kit blocks
  timestamp: number;
  sources?: string[];
}

export interface AlertEvent {
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  url?: string;
  timestamp: number;
  agentType: AgentType;
}
