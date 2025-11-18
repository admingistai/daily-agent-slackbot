import { WebClient } from "@slack/web-api";
import type { SlackPostRequest, SlackPostResponse } from "@daily-agent/shared";

export class SlackClient {
  private client: WebClient;

  constructor(token: string) {
    this.client = new WebClient(token);
  }

  /**
   * Post a message to a Slack channel
   */
  async postMessage(request: SlackPostRequest): Promise<SlackPostResponse> {
    try {
      const result = await this.client.chat.postMessage({
        channel: request.channel,
        text: request.text,
        blocks: request.blocks,
        metadata: request.metadata,
      });

      return {
        ok: result.ok,
        channel: result.channel as string,
        ts: result.ts as string,
        message: result.message as any,
      };
    } catch (error) {
      console.error("Error posting to Slack:", error);
      throw error;
    }
  }

  /**
   * Post a message with Block Kit blocks
   */
  async postBlocks(
    channel: string,
    text: string,
    blocks: unknown[]
  ): Promise<SlackPostResponse> {
    return this.postMessage({
      channel,
      text,
      blocks,
    });
  }

  /**
   * Post a simple text message
   */
  async postText(channel: string, text: string): Promise<SlackPostResponse> {
    return this.postMessage({
      channel,
      text,
    });
  }

  /**
   * Update an existing message
   */
  async updateMessage(
    channel: string,
    ts: string,
    text: string,
    blocks?: unknown[]
  ): Promise<void> {
    await this.client.chat.update({
      channel,
      ts,
      text,
      blocks,
    });
  }

  /**
   * Add a reaction to a message
   */
  async addReaction(
    channel: string,
    timestamp: string,
    reaction: string
  ): Promise<void> {
    await this.client.reactions.add({
      channel,
      timestamp,
      name: reaction,
    });
  }
}
