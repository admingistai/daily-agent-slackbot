import type { AgentType } from "./agent";
import type { DataSourceType } from "./data-source";

export interface KnowledgeEntry {
  id: string;
  sourceId: string;
  sourceType: DataSourceType;
  content: string;
  metadata: KnowledgeMetadata;
  embedding?: number[];
  agentType: AgentType;
}

export interface KnowledgeMetadata {
  title?: string;
  url?: string;
  timestamp: number;
  author?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface IngestionJob {
  id: string;
  dataSourceId: string;
  status: IngestionStatus;
  startedAt: number;
  completedAt?: number;
  itemsProcessed: number;
  errors?: string[];
}

export type IngestionStatus = "pending" | "running" | "completed" | "failed";

export interface IngestionResult {
  success: boolean;
  itemsProcessed: number;
  errors?: string[];
  metadata?: Record<string, unknown>;
}
