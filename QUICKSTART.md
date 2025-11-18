# Quick Start Guide

Follow these steps to get the Daily Agent Slackbot running locally.

## Prerequisites

- ✅ Bun installed
- ✅ Git repository set up
- ✅ Dependencies installed (`bun install`)

## Step-by-Step Setup

### 1. Initialize Convex

```bash
cd convex
bunx convex dev
```

**What happens:**
- Opens browser to create/login to Convex account
- Creates a new project
- Deploys schema and functions
- Generates `.env.local` with deployment URL

**Keep this terminal running!**

### 2. Create Slack Bot

Follow the detailed guide: [docs/SLACK_SETUP.md](docs/SLACK_SETUP.md)

**Quick version:**
1. Go to https://api.slack.com/apps
2. Create new app "From scratch"
3. Add scopes: `chat:write`, `chat:write.public`
4. Install to workspace
5. Copy the Bot User OAuth Token (starts with `xoxb-`)

### 3. Configure Environment Variables

Create `.env` in the project root:

```bash
cp .env.sample .env
```

Edit `.env` and add:

```bash
# Required
SLACK_BOT_TOKEN=xoxb-your-token-from-step-2
SLACK_TEST_CHANNEL=C123ABC456  # Your test channel ID

# Convex (copied from convex/.env.local)
CONVEX_DEPLOYMENT=your-deployment-url
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

**Get your test channel ID:**
1. Open Slack in browser
2. Go to your test channel (e.g., #test-bots)
3. Look at URL: `https://app.slack.com/client/T.../C123ABC...`
4. Copy the `C123ABC...` part

### 4. Test Slack Integration

```bash
bun run test:slack C123ABC456
```

Replace `C123ABC456` with your actual channel ID.

**Expected output:**
- ✅ Simple message posted
- ✅ Context digest posted
- ✅ Competitive digest posted
- ✅ Industry digest posted

Check your Slack channel - you should see 4 messages!

### 5. Run Development Servers

**Terminal 1: Convex (already running from step 1)**
```bash
cd convex
bunx convex dev
```

**Terminal 2: Console**
```bash
cd apps/console
bun run dev
```

Access console at: http://localhost:3000

## Troubleshooting

### Slack Errors

**"not_in_channel"**
- Add `chat:write.public` scope
- OR manually invite bot: `/invite @Daily Agent Bot`

**"invalid_auth"**
- Check token starts with `xoxb-`
- Copy the **Bot** token, not User token

**"channel_not_found"**
- Verify channel ID starts with `C`
- Make sure it's a public channel (or bot is invited)

### Convex Errors

**"Deployment not found"**
- Make sure `convex dev` is running
- Check `.env` has correct `CONVEX_DEPLOYMENT` URL

### General Errors

**Module not found**
- Run `bun install` again
- Check you're in the correct directory

**Port already in use**
- Console uses port 3000
- Kill existing process: `lsof -ti:3000 | xargs kill -9`

## Next Steps

Once everything is working:

1. **Configure agents** - Go to console → Agents
2. **Add data sources** - Console → Data Sources
3. **Schedule digests** - Set cron schedules
4. **Integrate AI** - Add OpenAI/Anthropic keys

## Architecture Reminder

This is a **simplified architecture**:
- ✅ One-way Slack posting (agents → Slack)
- ❌ No Slack event handling
- ❌ No slash commands

You can add two-way features later if needed.

## Need Help?

- 📖 Full docs: [docs/PRD.md](docs/PRD.md)
- 🔧 Slack setup: [docs/SLACK_SETUP.md](docs/SLACK_SETUP.md)
- 📝 Main README: [README.md](README.md)
