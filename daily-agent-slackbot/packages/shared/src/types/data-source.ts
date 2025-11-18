export type DataSourceType =
  | "linear"
  | "github"
  | "twitter"
  | "website"
  | "arxiv"
  | "slack"
  | "figma";

export type RefreshFrequency = "hourly" | "daily" | "weekly";

export interface DataSource {
  id: string;
  type: DataSourceType;
  name: string;
  config: DataSourceConfig;
  enabled: boolean;
  lastIngested?: number;
  metadata?: Record<string, unknown>;
}

export interface DataSourceConfig {
  apiKey?: string;
  url?: string;
  refreshFrequency: RefreshFrequency;
  // Type-specific config
  [key: string]: unknown;
}

export interface LinearConfig extends DataSourceConfig {
  apiKey: string;
  teamId?: string;
}

export interface GitHubConfig extends DataSourceConfig {
  apiKey: string;
  owner: string;
  repo: string;
}

export interface WebsiteConfig extends DataSourceConfig {
  url: string;
  crawlDepth?: number;
  selectors?: string[];
}

export interface TwitterConfig extends DataSourceConfig {
  apiKey: string;
  accounts: string[];
  keywords?: string[];
}

export interface ArxivConfig extends DataSourceConfig {
  searchQuery: string;
  maxResults?: number;
}
