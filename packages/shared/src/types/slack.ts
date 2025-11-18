import type { AgentType } from "./agent";

export interface SlackMessage {
  id: string;
  messageId: string;
  channel: string;
  userId?: string;
  text: string;
  timestamp: number;
  type: SlackMessageType;
  agentType?: AgentType;
  feedback?: "thumbs_up" | "thumbs_down";
}

export type SlackMessageType = "digest" | "alert";

export interface SlackPostRequest {
  channel: string;
  text: string;
  blocks?: unknown[];
  metadata?: Record<string, unknown>;
}

export interface SlackPostResponse {
  ok: boolean;
  channel: string;
  ts: string; // timestamp
  message?: {
    text: string;
    user: string;
    ts: string;
  };
}
