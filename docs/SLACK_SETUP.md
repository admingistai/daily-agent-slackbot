# Slack Bot Setup Guide

## Create Your Slack App

### 1. Go to Slack API Portal

Visit: https://api.slack.com/apps

### 2. Create New App

1. Click **"Create New App"**
2. Choose **"From scratch"**
3. **App Name**: "Daily Agent Bot" (or your choice)
4. **Workspace**: Select your Slack workspace
5. Click **"Create App"**

### 3. Configure Bot Token Scopes

1. In the left sidebar, click **"OAuth & Permissions"**
2. Scroll down to **"Scopes"** → **"Bot Token Scopes"**
3. Click **"Add an OAuth Scope"** and add these:
   - `chat:write` - Post messages
   - `chat:write.public` - Post to channels without joining

### 4. Install App to Workspace

1. Scroll to top of **"OAuth & Permissions"** page
2. Click **"Install to Workspace"**
3. Click **"Allow"**
4. **Copy the "Bot User OAuth Token"** (starts with `xoxb-`)
   - Save this for your `.env` file

### 5. Get Your Test Channel ID

1. Open Slack in browser
2. Navigate to the channel you want to test with (e.g., #test-bots)
3. Look at the URL: `https://app.slack.com/client/T.../C123ABC...`
4. The part after the last `/` (starting with `C`) is your **channel ID**
5. Save this - you'll need it for testing

## Environment Variables

Add these to your `.env` file:

```bash
SLACK_BOT_TOKEN=xoxb-your-token-here
```

## Test Your Bot

Once configured, you can test posting with:

```bash
bun run test:slack
```

## Troubleshooting

### "not_in_channel" error
- Make sure you used `chat:write.public` scope
- OR manually invite the bot to the channel: `/invite @Daily Agent Bot`

### "invalid_auth" error
- Check that your token starts with `xoxb-`
- Make sure you copied the **Bot** token, not the User token

### Can't see bot in workspace
- Make sure you clicked "Install to Workspace"
- Check Apps section in Slack sidebar
