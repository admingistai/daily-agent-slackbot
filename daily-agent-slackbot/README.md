# Daily Agent Slackbot

A multi-agent intelligence system that delivers automated intelligence briefings via Slack. Built with Bun, Next.js 16, Convex, and Vercel.

## Overview

This project provides three specialized AI agents that monitor different intelligence streams:

- **Context Agent** - Internal project intelligence (Linear, GitHub, Slack, Figma)
- **Competitive Agent** - Competitor tracking (blogs, Twitter, press)
- **Industry Agent** - GEO/AI/Agent research (arXiv, HN, Reddit)

### Simplified Architecture

- **Slack**: One-way posting only - agents push messages to channels
- **Console**: Admin UI for managing agents and data sources
- **Agents**: Generate digests and send to Slack
- **Convex**: Real-time database and backend functions

## Project Structure

```
daily-agent-slackbot/
├── apps/
│   ├── console/          # Next.js 16 Admin Console
│   └── agents/           # Agent functions
├── packages/
│   ├── convex/          # Convex backend
│   ├── shared/          # Shared types & utilities
│   ├── slack/           # Slack posting utilities
│   └── integrations/    # Data source clients
├── convex/              # Convex schema & functions
└── docs/                # Documentation
```

## Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- [Convex](https://www.convex.dev/) account
- [Slack](https://api.slack.com/) bot token
- [Vercel](https://vercel.com/) account (for deployment)

## Setup Instructions

### 1. Clone and Install

```bash
git clone git@github.com:admingistai/daily-agent-slackbot.git
cd daily-agent-slackbot
bun install
```

### 2. Configure Environment Variables

```bash
cp .env.sample .env
```

Edit `.env` and fill in your credentials:

```bash
# Required
SLACK_BOT_TOKEN=xoxb-your-bot-token
CONVEX_DEPLOYMENT=your-deployment-url
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Optional (for data sources)
LINEAR_API_KEY=lin_api_your-key
GITHUB_TOKEN=ghp_your-token
```

### 3. Initialize Convex

```bash
cd packages/convex
bunx convex dev
```

This will:
- Create a new Convex deployment
- Deploy the schema and functions
- Generate TypeScript types

### 4. Run Development Servers

In separate terminals:

```bash
# Terminal 1: Run all apps
bun run dev

# Or run individually:
# Terminal 1: Console
cd apps/console
bun run dev

# Terminal 2: Convex
cd packages/convex
bun run dev
```

Access the console at `http://localhost:3000`

## Creating a Slack Bot

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create a new app "From scratch"
3. Go to "OAuth & Permissions"
4. Add these scopes:
   - `chat:write`
   - `chat:write.public`
5. Install to workspace
6. Copy the "Bot User OAuth Token" to `.env` as `SLACK_BOT_TOKEN`

## Usage

### Configure Agents

1. Open console at `http://localhost:3000`
2. Navigate to "Agents"
3. Enable/disable agents
4. Set Slack channels for each agent
5. Configure digest schedules

### Configure Data Sources

1. Navigate to "Data Sources"
2. Add Linear, GitHub, or other sources
3. Enter API keys
4. Set refresh frequency

### Manual Digest Generation

```typescript
import { generateDigest, postDigestToSlack } from "@daily-agent/agents";

const digest = await generateDigest("context");
await postDigestToSlack(digest, "#team-updates", process.env.SLACK_BOT_TOKEN);
```

## Development

### Type Checking

```bash
bun run type-check
```

### Linting

```bash
bun run lint
```

### Building

```bash
bun run build
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

### Deploy Convex

```bash
cd packages/convex
bunx convex deploy
```

## Package Reference

### @daily-agent/shared

Shared types, schemas, and utilities.

```typescript
import { AgentType, DigestContent } from "@daily-agent/shared";
import { agentSchema } from "@daily-agent/shared";
import { formatDate, chunkText } from "@daily-agent/shared";
```

### @daily-agent/slack

Slack posting utilities (one-way).

```typescript
import { SlackClient, formatDigest } from "@daily-agent/slack";

const slack = new SlackClient(token);
await slack.postText("#channel", "Hello!");
```

### @daily-agent/integrations

Data source API clients (coming soon).

```typescript
import { LinearClient, GitHubClient } from "@daily-agent/integrations";
```

## Convex Functions

### Queries

- `dataSources.list()` - Get all data sources
- `agents.getEnabled()` - Get enabled agents
- `knowledge.getRecentByAgent()` - Get recent knowledge

### Mutations

- `dataSources.create()` - Create data source
- `agents.update()` - Update agent config
- `knowledge.add()` - Add knowledge entry

## Architecture Notes

### Simplified vs Full PRD

This scaffold implements a simplified architecture:

**Included:**
- ✅ Admin console for configuration
- ✅ Agent digest generation
- ✅ One-way Slack posting
- ✅ Convex backend
- ✅ Data source configuration

**Not Included (yet):**
- ❌ Slack event handling
- ❌ Slash commands
- ❌ Interactive Block Kit responses
- ❌ Two-way Slack communication

These can be added later if needed.

## Contributing

See [PRD.md](docs/PRD.md) for full product requirements and architecture details.

## License

Private - ProRata.ai

## Support

For questions or issues, contact the team or open an issue on GitHub.
