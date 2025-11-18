# Product Requirements Document: Multi-Agent Intelligence Slackbot

**Version 2.0 - Vercel + Convex Architecture**

Last Updated: November 18, 2025

---

## Executive Summary

A multi-agent intelligence system that delivers automated intelligence briefings via Slack, combining internal project context, competitive intelligence, and industry research. Built on Vercel (serverless) + Convex (real-time database) with a Bun monorepo structure.

**Core Value Proposition:**

- Automated daily digests of internal, competitive, and industry intelligence
- Two-way Slack integration for on-demand queries
- Admin console for managing data sources and agent configuration
- Fully serverless architecture on Vercel with Convex backend

---

## Problem Statement

Teams at ProRata.ai need constant awareness of three critical information streams:

1. **Internal Context** - Project status, ownership, documentation location
2. **Competitive Landscape** - Competitor launches, funding, feature releases
3. **Industry Developments** - GEO/AI/Agent research, emerging technologies

Currently, this requires manual monitoring of dozens of sources, leading to:

- Information gaps and blind spots
- Delayed responses to critical changes
- Wasted time on repetitive research tasks
- Scattered knowledge across Linear, Slack, GitHub, Figma

---

## Goals & Success Metrics

### Primary Goals

1. Deliver daily intelligence briefings to Slack at 9 AM PT
2. Respond to on-demand queries via Slack commands/mentions
3. Surface urgent updates (funding, feature launches) immediately
4. Reduce time spent on competitive research by 80%

### Success Metrics

| Metric                  | Target                          | Measurement                  |
| ----------------------- | ------------------------------- | ---------------------------- |
| Daily digest read rate  | 80%+ of team within 24hrs       | Slack reactions/analytics    |
| Query response accuracy | 90%+ helpful responses          | User feedback thumbs up/down |
| Alert relevance         | <5% false positives on "urgent" | Manual review                |
| Time savings            | 4+ hours per team member/week   | Team survey                  |
| Agent uptime            | 99%+                            | Vercel analytics             |

---

## Technical Architecture

### Tech Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL PLATFORM                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Admin UI   │  │  Slack API   │  │ Agent Cron   │    │
│  │  (Next.js)   │  │  (Next.js)   │  │   Jobs       │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                            │                               │
│                            ▼                               │
│                    ┌─────────────┐                         │
│                    │   CONVEX    │                         │
│                    │  Database   │                         │
│                    │ + Functions │                         │
│                    └─────────────┘                         │
│                            │                               │
│                            ▼                               │
│                   [Vector DB/Storage]                      │
│                   (Pinecone/Convex)                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │    SLACK    │
                    │   Channel   │
                    └─────────────┘
```

### Monorepo Structure (Bun Workspaces)

```
daily-agent-slackbot/
├── package.json                    # Bun workspace root
├── bun.lock
├── turbo.json                      # Build orchestration
├── vercel.json                     # Deployment config
│
├── apps/
│   ├── admin/                      # Next.js 16 Admin Console
│   │   ├── app/
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── data-sources/       # Connect Linear, URLs, etc.
│   │   │   ├── agents/             # Configure 3 agents
│   │   │   └── settings/           # API keys, Slack config
│   │   ├── convex/
│   │   │   └── _generated/         # Convex types
│   │   └── package.json
│   │
│   ├── api/                        # Next.js 16 API Routes
│   │   ├── app/api/
│   │   │   ├── slack/
│   │   │   │   ├── events/route.ts      # Receives Slack events
│   │   │   │   ├── interactions/route.ts # Block Kit interactions
│   │   │   │   └── commands/route.ts     # Slash commands
│   │   │   ├── cron/
│   │   │   │   ├── daily-digest/route.ts   # 9 AM PT trigger
│   │   │   │   └── ingest-sources/route.ts # Hourly data refresh
│   │   │   └── webhooks/
│   │   │       └── agent-callback/route.ts # Agent async responses
│   │   └── package.json
│   │
│   └── agent/                      # Agent Logic (Serverless Functions)
│       ├── functions/
│       │   ├── generate-digest.ts   # Main digest generator
│       │   ├── answer-query.ts      # On-demand Q&A
│       │   └── process-alert.ts     # Urgent alert handler
│       └── package.json
│
├── packages/
│   ├── convex/                     # Convex Backend
│   │   ├── schema.ts               # Database schema
│   │   ├── dataSources.ts          # CRUD for data sources
│   │   ├── agents.ts               # Agent configs
│   │   ├── knowledge.ts            # Knowledge base storage
│   │   ├── ingestion.ts            # Data ingestion functions
│   │   └── http.ts                 # HTTP actions
│   │
│   ├── slack/                      # Slack Integration
│   │   ├── src/
│   │   │   ├── client.ts           # Bolt.js wrapper
│   │   │   ├── blocks.ts           # Block Kit builders
│   │   │   ├── events.ts           # Event handlers
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   ├── ai/                         # AI/LLM Logic (Placeholder)
│   │   ├── src/
│   │   │   ├── index.ts            # Main AI interface
│   │   │   ├── embeddings.ts       # Text embedding
│   │   │   ├── completion.ts       # LLM calls
│   │   │   └── rag.ts              # RAG pipeline
│   │   └── package.json
│   │
│   ├── integrations/               # External API Clients
│   │   ├── src/
│   │   │   ├── linear.ts           # Linear API
│   │   │   ├── github.ts           # GitHub API
│   │   │   ├── twitter.ts          # Twitter/X API
│   │   │   ├── arxiv.ts            # arXiv search
│   │   │   └── scraper.ts          # Web scraping
│   │   └── package.json
│   │
│   └── shared/                     # Shared Types & Utils
│       ├── src/
│       │   ├── types/
│       │   │   ├── agent.ts
│       │   │   ├── slack.ts
│       │   │   ├── data-source.ts
│       │   │   └── digest.ts
│       │   ├── schemas/            # Zod validation
│       │   └── utils/
│       └── package.json
│
└── convex/                         # Convex config
    ├── convex.json
    └── tsconfig.json
```

---

## Core Components

### 1. Admin Console (`apps/admin`)

**Purpose:** Web UI for configuring the intelligence system

**Key Pages:**

#### Dashboard (`/`)

- Quick stats: Last digest sent, active data sources, query count
- Recent activity feed
- Agent health status

#### Data Sources (`/data-sources`)

- **Internal Sources:**
  - Connect Linear (API key input)
  - Connect GitHub (OAuth)
  - Connect Slack (workspace picker)
  - Connect Figma (OAuth)
- **Competitive Sources:**
  - Add competitor websites (URL input + crawl frequency)
  - Add Twitter/X accounts to monitor
  - Add RSS feeds
- **Industry Sources:**
  - arXiv search queries
  - Reddit subreddits
  - HackerNews keywords

#### Agent Configuration (`/agents`)

- Enable/disable Context, Competitive, Industry agents
- Set digest schedule (default 9 AM PT)
- Configure alert thresholds (what counts as "urgent")
- Set Slack channels for each agent

#### Settings (`/settings`)

- Slack bot token & signing secret
- API keys (OpenAI, Anthropic, etc.)
- Vector DB configuration
- Notification preferences

**Tech Details:**

- Next.js 16 App Router
- Server Components for data fetching
- Server Actions for form submissions
- Convex React hooks for real-time updates
- Tailwind + shadcn/ui for UI

---

### 2. Slack API (`apps/api`)

**Purpose:** Handle all Slack communication (two-way)

#### Endpoints:

##### `POST /api/slack/events`

Receives all Slack events (messages, mentions, etc.)

**Flow:**

1. Validate Slack signature
2. Acknowledge immediately (< 3 seconds)
3. Parse event type (message, app_mention, etc.)
4. Queue for agent processing if needed
5. Invoke Convex function or serverless agent

**Example Event:**

```json
{
  "type": "event_callback",
  "event": {
    "type": "app_mention",
    "user": "U123456",
    "text": "<@BOT_ID> what's the status of onboarding redesign?",
    "channel": "C789012"
  }
}
```

##### `POST /api/slack/commands`

Handles slash commands

**Supported Commands:**

- `/gist status <project>` - Query project status
- `/gist competitors` - Get latest competitive intel
- `/gist research <topic>` - Search industry research
- `/gist digest` - Trigger manual digest

##### `POST /api/slack/interactions`

Handles Block Kit interactions (buttons, modals)

**Example:**
User clicks "Mark as read" on a digest → Update Convex record

##### `GET/POST /api/cron/daily-digest`

Vercel Cron job that runs at 9 AM PT

**Flow:**

1. Trigger invoked by Vercel Cron
2. Query Convex for enabled agents
3. Call agent functions to generate digests
4. Format with Block Kit
5. Post to configured Slack channels

---

### 3. Convex Backend (`packages/convex`)

**Purpose:** Real-time database + serverless backend functions

#### Schema (`schema.ts`)

```typescript
export default defineSchema({
  // Data Source Configuration
  dataSources: defineTable({
    type: v.string(), // "linear" | "github" | "twitter" | "website"
    name: v.string(),
    config: v.object({
      apiKey: v.optional(v.string()),
      url: v.optional(v.string()),
      refreshFrequency: v.string(), // "hourly" | "daily"
    }),
    enabled: v.boolean(),
    lastIngested: v.optional(v.number()),
    metadata: v.optional(v.any()),
  }).index("by_type", ["type"]),

  // Agent Configuration
  agents: defineTable({
    type: v.string(), // "context" | "competitive" | "industry"
    name: v.string(),
    enabled: v.boolean(),
    config: v.object({
      slackChannel: v.string(),
      digestSchedule: v.string(), // cron expression
      alertThresholds: v.any(),
    }),
    lastRun: v.optional(v.number()),
  }).index("by_type", ["type"]),

  // Knowledge Base (chunked documents)
  knowledge: defineTable({
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
    agentType: v.string(), // "context" | "competitive" | "industry"
  })
    .index("by_source", ["sourceId"])
    .index("by_agent", ["agentType"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536, // OpenAI ada-002
      filterFields: ["sourceType", "agentType"],
    }),

  // Slack Messages Log
  slackMessages: defineTable({
    messageId: v.string(),
    channel: v.string(),
    userId: v.string(),
    text: v.string(),
    timestamp: v.number(),
    type: v.string(), // "digest" | "query_response" | "alert"
    agentType: v.optional(v.string()),
    feedback: v.optional(v.string()), // "thumbs_up" | "thumbs_down"
  })
    .index("by_channel", ["channel"])
    .index("by_type", ["type"]),

  // Ingestion Jobs
  ingestionJobs: defineTable({
    dataSourceId: v.id("dataSources"),
    status: v.string(), // "pending" | "running" | "completed" | "failed"
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    itemsProcessed: v.number(),
    errors: v.optional(v.array(v.string())),
  })
    .index("by_status", ["status"])
    .index("by_source", ["dataSourceId"]),
});
```

#### Key Convex Functions

##### Mutations

**`addDataSource()`**

```typescript
export const addDataSource = mutation({
  args: {
    type: v.string(),
    name: v.string(),
    config: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dataSources", {
      ...args,
      enabled: true,
      metadata: {},
    });
  },
});
```

**`ingestFromSource()`**

```typescript
export const ingestFromSource = mutation({
  args: { sourceId: v.id("dataSources") },
  handler: async (ctx, args) => {
    const source = await ctx.db.get(args.sourceId);
    // Trigger ingestion logic
    // Chunk content, generate embeddings, store in knowledge table
  },
});
```

##### Queries

**`getEnabledAgents()`**

```typescript
export const getEnabledAgents = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("agents")
      .filter((q) => q.eq(q.field("enabled"), true))
      .collect();
  },
});
```

**`searchKnowledge()`**

```typescript
export const searchKnowledge = query({
  args: {
    agentType: v.string(),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Vector search using embedding
    const embedding = await generateEmbedding(args.query);
    return await ctx.db
      .query("knowledge")
      .withIndex("by_embedding", (q) => q.eq("agentType", args.agentType))
      .vector("by_embedding", embedding)
      .take(args.limit ?? 10);
  },
});
```

##### Actions (HTTP endpoints)

**`receiveSlackEvent()`**

```typescript
export const receiveSlackEvent = httpAction(async (ctx, request) => {
  const body = await request.json();

  // Verify Slack signature
  const isValid = verifySlackSignature(request, body);
  if (!isValid) return new Response("Unauthorized", { status: 401 });

  // Handle URL verification challenge
  if (body.type === "url_verification") {
    return Response.json({ challenge: body.challenge });
  }

  // Process event asynchronously
  await ctx.runMutation(internal.slack.processEvent, { event: body });

  return new Response("OK", { status: 200 });
});
```

---

### 4. Agent Logic (`apps/agent`)

**Purpose:** Serverless functions that generate digests and answer queries

#### Functions:

##### `generate-digest.ts`

```typescript
export async function generateDigest(
  agentType: "context" | "competitive" | "industry"
) {
  // 1. Query Convex for latest knowledge
  const recentDocs = await convex.query(api.knowledge.getRecentByAgent, {
    agentType,
    since: Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
  });

  // 2. Use AI SDK to generate summary (placeholder)
  const summary = await generateSummary(recentDocs);

  // 3. Format with Block Kit
  const blocks = formatAsSlackBlocks(summary);

  // 4. Return digest
  return {
    agentType,
    content: summary,
    blocks,
    timestamp: Date.now(),
  };
}
```

##### `answer-query.ts`

```typescript
export async function answerQuery(
  query: string,
  agentType: string,
  userId: string
) {
  // 1. Search knowledge base (RAG)
  const relevantDocs = await convex.query(api.knowledge.searchKnowledge, {
    agentType,
    query,
    limit: 5,
  });

  // 2. Generate answer using LLM (placeholder)
  const answer = await generateAnswer(query, relevantDocs);

  // 3. Return formatted response
  return {
    answer,
    sources: relevantDocs.map((d) => d.metadata.url),
    confidence: 0.85, // Mock for now
  };
}
```

##### `process-alert.ts`

```typescript
export async function processAlert(event: any) {
  // Determine if event is "urgent" based on rules
  const isUrgent = checkUrgency(event);

  if (isUrgent) {
    // Send immediate Slack notification
    await postToSlack({
      channel: "#alerts",
      text: `🚨 URGENT: ${event.title}`,
      blocks: formatAlertBlocks(event),
    });
  }
}
```

---

## Data Flow Diagrams

### Flow 1: Daily Digest Generation

```
9:00 AM PT (Vercel Cron)
  ↓
POST /api/cron/daily-digest
  ↓
Query Convex → Get enabled agents
  ↓
For each agent:
  ├─ Query Convex → Get knowledge from last 24hrs
  ├─ Call agent function → generateDigest()
  ├─ AI processing (placeholder)
  └─ Format with Block Kit
  ↓
Post to Slack via @slack/bolt
  ↓
Log message in Convex
```

### Flow 2: User Query (Slack → Agent → Response)

```
User: "@GistBot what's blocking the v0 release?"
  ↓
Slack sends app_mention event
  ↓
POST /api/slack/events
  ↓
Acknowledge immediately (< 3 sec)
  ↓
Extract query & user info
  ↓
Async: Call answerQuery(query, "context", userId)
  ├─ Search Convex knowledge base (vector search)
  ├─ Retrieve relevant docs
  ├─ AI generates answer (placeholder)
  └─ Return answer + sources
  ↓
Post response to Slack (in thread)
  ↓
Log interaction in Convex
```

### Flow 3: Data Ingestion (Continuous)

```
Hourly Cron Job
  ↓
POST /api/cron/ingest-sources
  ↓
Query Convex → Get all enabled data sources
  ↓
For each source:
  ├─ Check lastIngested timestamp
  ├─ If stale → trigger ingestion
  ├─ Fetch data via integration package
  │   ├─ Linear API → issues/comments
  │   ├─ GitHub API → PRs/commits
  │   ├─ Twitter → mentions/posts
  │   └─ Web scraper → competitor blogs
  ├─ Chunk content (500-1000 tokens)
  ├─ Generate embeddings (OpenAI/placeholder)
  └─ Store in Convex knowledge table
  ↓
Update lastIngested timestamp
  ↓
Log job completion
```

---

## Agent Specifications

### 1. Context EM/PM Agent

**Purpose:** Internal project intelligence and team knowledge

**Data Sources:**

- Linear (issues, comments, status)
- GitHub (PRs, commits, reviews)
- Slack (discussions, decisions)
- Figma (file updates, comments)

**Capabilities:**

**Daily Digest (9 AM PT):**

- Sprint progress & blockers
- PRs pending review
- Design files updated
- Key decisions from Slack threads

**On-Demand Queries:**

- "Who owns [feature]?"
- "Where is the [design]?"
- "What's blocking [release]?"
- "Show decisions about [topic] from last week"

**Output Format:**

```
🏃 *Context Digest - Nov 18 AM*

*In Progress:*
• Onboarding widget v2 (@alice) - PR #234 ready for review
• TikTok ingestion (@bob) - Blocked on API rate limits

*Shipped Yesterday:*
• Dashboard analytics - merged to main

*Needs Attention:*
• Design review for search widget - 2 days old
• 3 PRs waiting >24hrs

[View Linear] [Pending PRs]
```

---

### 2. Competitive Research Agent

**Purpose:** Track competitor activities and launches

**Target Competitors:** (configurable in admin)

- Direct: [Perplexity, SearchGPT, etc.]
- Adjacent: [Related GEO tools]

**Data Sources:**

- Company blogs/changelogs
- Twitter/X accounts
- LinkedIn pages
- TechCrunch, VentureBeat (RSS)
- Reddit mentions
- Hacker News

**Capabilities:**

**Daily Digest (9 AM PT):**

- New blog posts, changelog updates
- Social media highlights
- Earned media coverage
- Job postings (growth signals)

**Urgent Alerts (immediate):**

- Funding announcements
- Major feature launches
- Executive changes
- Press in tier-1 outlets

**Output Format:**

```
🎯 *Competitive Intel - Nov 18*

*[Competitor A]:*
• Launched AI Overview tool (blog)
  → Pricing: $299/mo, focuses on E-E-A-T
  → HN: 234 points, mostly positive
• CEO in TechCrunch: targeting enterprise
• Hiring 2x ML engineers

*[Competitor B]:*
• Website update: new case studies
• Twitter: "big announcement next week" (243 likes)

🚨 *URGENT*: [Competitor C] raised $10M Series A

[Sources]
```

---

### 3. Industry Research Agent

**Purpose:** Monitor GEO/AI/Agent research and trends

**Data Sources:**

- arXiv (cs.AI, cs.CL, cs.IR)
- Twitter/X (AI thought leaders)
- Reddit (r/MachineLearning, r/LocalLLaMA)
- Hacker News
- Google search trends

**Capabilities:**

**Daily Digest (9 AM PT):**

- New relevant arXiv papers
- Trending AI discussions
- New tools/frameworks
- Conference announcements

**Weekly Deep Dive (Mondays):**

- Top 5 must-read papers
- Emerging patterns
- Implications for Gist GEO

**Output Format:**

```
📚 *Industry Research - Nov 18*

*New Papers:*
• "Optimizing LLM Responses for Search Visibility"
  → Framework for measuring GEO effectiveness
  → Key: Structured data boosts citation by 34%
  → [arXiv link]

*Trending:*
• HN: "Google AI Overviews now cite sources" (412pts)
  → Transparency becoming table stakes
• @sama on agentic workflows (10K+ likes)

*New Tools:*
• LangGraph 0.3 - improved streaming

[Links]
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Basic infrastructure + Slack posting

**Tasks:**

- [x] Set up Bun monorepo with workspaces
- [x] Initialize Convex project
- [x] Create `packages/shared` with core types
- [x] Build `apps/api` with basic Slack endpoints
- [x] Test posting to Slack (one-way)

**Deliverable:** Can manually POST to `/api/slack/post` and see message in Slack

---

### Phase 2: Admin Console (Week 2)

**Goal:** UI for configuring data sources

**Tasks:**

- [ ] Build `apps/admin` with Next.js 16
- [ ] Create data source connection pages
- [ ] Implement Convex schema for config storage
- [ ] Add forms for Linear, GitHub, URLs
- [ ] Build agent enable/disable UI

**Deliverable:** Admin can add data sources and enable agents via web UI

---

### Phase 3: Data Ingestion (Week 3)

**Goal:** Actually fetch data from sources

**Tasks:**

- [ ] Build `packages/integrations` with API clients
- [ ] Implement Linear API integration
- [ ] Implement basic web scraper
- [ ] Create Convex ingestion functions
- [ ] Set up hourly cron job for ingestion
- [ ] Test chunking + embedding (mock for now)

**Deliverable:** Data flows from Linear → Convex knowledge base

---

### Phase 4: Two-Way Slack (Week 4)

**Goal:** Handle Slack events and respond

**Tasks:**

- [ ] Implement `/api/slack/events` endpoint
- [ ] Add slash command handlers
- [ ] Build agent query function (with mock AI)
- [ ] Test full round-trip: Slack command → agent → response
- [ ] Add feedback mechanism (thumbs up/down)

**Deliverable:** User can @mention bot and get a mock response

---

### Phase 5: Daily Digest (Week 5)

**Goal:** Automated digest generation

**Tasks:**

- [ ] Set up Vercel Cron for 9 AM PT
- [ ] Build digest generation logic
- [ ] Implement Block Kit formatting
- [ ] Test all 3 agent digests
- [ ] Add opt-in/opt-out controls

**Deliverable:** Daily digest posts to Slack at 9 AM PT

---

### Phase 6: AI Integration (Weeks 6-8)

**Goal:** Replace mock AI with real LLMs

**Tasks:**

- [ ] Integrate OpenAI/Anthropic API
- [ ] Implement vector embeddings
- [ ] Build RAG pipeline for queries
- [ ] Add prompt engineering for digests
- [ ] Optimize context window usage
- [ ] Add cost monitoring

**Deliverable:** Agent gives real, context-aware answers

---

### Phase 7: Polish & Scale (Weeks 9-10)

**Goal:** Production-ready

**Tasks:**

- [ ] Add 10+ competitor sources
- [ ] Implement freshness weighting
- [ ] Add sentiment analysis
- [ ] Build analytics dashboard
- [ ] Optimize performance (<3s response)
- [ ] Add error monitoring (Sentry)

**Deliverable:** Production launch to team

---

## Technical Specifications

### Deployment Strategy

**Everything on Vercel:**

```json
// vercel.json
{
  "buildCommand": "bun run build",
  "framework": null,
  "crons": [
    {
      "path": "/api/cron/daily-digest",
      "schedule": "0 16 * * *" // 9 AM PT = 4 PM UTC
    },
    {
      "path": "/api/cron/ingest-sources",
      "schedule": "0 * * * *" // Every hour
    }
  ],
  "functions": {
    "apps/api/app/api/**/*.ts": {
      "maxDuration": 60
    },
    "apps/agent/functions/**/*.ts": {
      "maxDuration": 120
    }
  }
}
```

**Build Configuration:**

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

---

### Environment Variables

```bash
# .env.example

# Slack
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token  # For Socket Mode (optional)

# Convex
CONVEX_DEPLOYMENT=your-deployment-url
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# OpenAI (or other LLM)
OPENAI_API_KEY=sk-your-api-key
ANTHROPIC_API_KEY=sk-ant-your-api-key  # Optional

# Data Source APIs
LINEAR_API_KEY=lin_api_your-key
GITHUB_TOKEN=ghp_your-token
TWITTER_BEARER_TOKEN=your-bearer-token

# Vector DB (if not using Convex)
PINECONE_API_KEY=your-key  # Optional
PINECONE_ENVIRONMENT=us-east-1-aws  # Optional

# Internal
API_SECRET_KEY=your-random-secret-for-internal-auth
VERCEL_ENV=production  # Managed by Vercel
```

---

### API Authentication

**Internal APIs** (agent → API):

```typescript
// Middleware
function requireApiKey(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.API_SECRET_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
}
```

**Slack Events** (Slack → API):

```typescript
import crypto from "crypto";

function verifySlackSignature(req: Request, body: string) {
  const timestamp = req.headers.get("x-slack-request-timestamp");
  const signature = req.headers.get("x-slack-signature");

  const hmac = crypto
    .createHmac("sha256", process.env.SLACK_SIGNING_SECRET!)
    .update(`v0:${timestamp}:${body}`)
    .digest("hex");

  return `v0=${hmac}` === signature;
}
```

---

## Data Source Integration Details

### Linear Integration

**API:** `https://api.linear.app/graphql`

**Key Queries:**

```graphql
query GetRecentIssues {
  issues(filter: { updatedAt: { gte: "2025-11-17" } }, first: 50) {
    nodes {
      id
      title
      description
      state {
        name
      }
      assignee {
        name
      }
      comments {
        nodes {
          body
        }
      }
    }
  }
}
```

**Ingestion Flow:**

1. Fetch issues updated in last 24hrs
2. Chunk description + comments (max 1000 tokens each)
3. Generate embeddings
4. Store in Convex with metadata:
   - Source: "linear"
   - URL: `https://linear.app/issue/${id}`
   - Assignee, status, timestamp

---

### GitHub Integration

**API:** `https://api.github.com/repos/{owner}/{repo}`

**Key Endpoints:**

- `/pulls` - Recent PRs
- `/commits` - Recent commits
- `/issues` - Issues

**Ingestion Flow:**

1. Fetch PRs/commits from last 24hrs
2. Extract: title, description, author, review comments
3. Chunk if needed
4. Store with metadata:
   - Source: "github"
   - URL: PR/commit URL
   - Author, status

---

### Web Scraping (Competitors)

**Tool:** Firecrawl API or Playwright

**Example Sites:**

- Perplexity blog: `https://blog.perplexity.ai`
- SearchGPT updates: `https://searchgpt.com/changelog`

**Ingestion Flow:**

1. Crawl target URL
2. Extract: title, publish date, content
3. Check for duplicates (hash-based)
4. Chunk content (500-1000 tokens)
5. Store with metadata:
   - Source: "website"
   - Competitor: "Perplexity"
   - URL, date

---

### Twitter/X Integration

**API:** Twitter API v2 (paid tier for search)

**Endpoints:**

- `/tweets/search/recent` - Recent tweets mentioning competitors

**Ingestion Flow:**

1. Search for competitor mentions
2. Filter by engagement (min 50 likes)
3. Store tweet text + metadata:
   - Author, likes, retweets
   - URL to tweet

**Rate Limits:** 450 requests/15min (app-level)

---

### arXiv Integration

**API:** `http://export.arxiv.org/api/query`

**Query Example:**

```
search_query=all:generative+engine+optimization&start=0&max_results=10
```

**Ingestion Flow:**

1. Daily search for relevant papers
2. Extract: title, abstract, authors, date
3. Check if already ingested (arXiv ID)
4. Store with metadata:
   - Source: "arxiv"
   - URL: `https://arxiv.org/abs/{id}`
   - Authors, publish date

---

## Success Criteria & KPIs

### Adoption Metrics

- **Daily digest open rate:** 80%+ (measured via Slack reactions)
- **Query volume:** 10+ per week
- **Active users:** 100% of team using within 1 month

### Quality Metrics

- **Answer accuracy:** 90%+ (measured via thumbs up/down)
- **False positive alerts:** <5%
- **Response time:** <5s for queries, <3s for digests
- **Agent uptime:** 99%+

### Business Impact

- **Time saved:** 4+ hours per team member per week
- **Competitive insights:** 10+ actionable insights per month
- **Feature velocity:** Track time from "competitor ships X" to "we ship Y"

### Cost Targets

- **Total monthly cost:** <$500 (LLM API + infrastructure)
- **Cost per query:** <$0.10
- **Cost per digest:** <$1

---

## Risk Assessment & Mitigation

| Risk                                | Impact | Likelihood | Mitigation                                                    |
| ----------------------------------- | ------ | ---------- | ------------------------------------------------------------- |
| API rate limits (Twitter, Linear)   | High   | Medium     | Exponential backoff, caching, multiple keys                   |
| Vercel cold starts delay responses  | Medium | Medium     | Keep functions warm with health checks                        |
| LLM costs spiral                    | High   | Medium     | Cache similar queries, use smaller models for simple tasks    |
| Noisy digests (too much info)       | Medium | High       | A/B test length, add relevance scoring, user feedback loop    |
| Hallucinations (LLM makes up facts) | High   | Medium     | Always cite sources, validate against KB, flag low confidence |
| Alert fatigue                       | Medium | Medium     | Strict thresholds, user feedback, weekly tuning               |
| Convex scale limits                 | Low    | Low        | Monitor usage, consider Pinecone for vectors if needed        |

---

## Open Questions

1. **Which competitors should we prioritize?** (need list from team)
2. **Slack workspace setup:** Do we have a dedicated #intelligence channel?
3. **Budget approval:** $500/mo for APIs okay?
4. **Admin access:** Who configures data sources? (PM? Eng lead?)
5. **Privacy concerns:** Slack message ingestion - any channels to exclude?
6. **Urgency thresholds:** What counts as "urgent" for alerts?
7. **Digest length:** How long should the daily digest be? (target word count)

---

## Next Steps

1. **Review this PRD** with team (get feedback)
2. **Prioritize competitors** to track
3. **Set up infrastructure:**
   - Create Vercel project
   - Initialize Convex deployment
   - Create Slack app
4. **Start Phase 1** (Foundation week)

---

## Appendix

### Useful Resources

- **Slack Bolt.js docs:** https://slack.dev/bolt-js
- **Convex docs:** https://docs.convex.dev
- **Vercel Cron:** https://vercel.com/docs/cron-jobs
- **Bun workspaces:** https://bun.sh/docs/pm/workspaces
- **Linear API:** https://developers.linear.app
- **arXiv API:** https://info.arxiv.org/help/api

### Team Contacts

- **Product:** [PM Name]
- **Engineering Lead:** [Eng Lead Name]
- **Design:** [Designer Name]
- **Stakeholders:** [Founder Name]

---

**Document Version:** 2.0
**Last Updated:** November 18, 2025
**Status:** Ready for Review
