import {
  APIInteraction,
  APIInteractionResponseCallbackData,
  InteractionResponseType,
  MessageFlags,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
  RESTPostAPIInteractionFollowupJSONBody,
} from 'discord-api-types/v10';
import { Client } from '@src/structs/clients';

export class BaseContext<T extends APIInteraction> {
  params: {
    [k: string]: string | undefined;
  } = {};
  constructor(
    public data: T,
    public client: Client,
  ) { }

  public async reply(message: APIInteractionResponseCallbackData & {
    files?: {
      name: string;
      file: Buffer | import("stream").Readable | import("stream/web").ReadableStream;
    }[] | undefined
  }, returnReply = false) {
    await this.client.rest.interaction.createInteractionResponse(this.data.id, this.data.token, {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: message,
      files: message?.files
    });
    if (returnReply) return await this.getMessage();
  }

  public async defer(ephemeral: boolean) {
    return this.client.rest.interaction.createInteractionResponse(this.data.id, this.data.token, {
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data: {
        flags: ephemeral ? MessageFlags.Ephemeral : undefined
      }
    })
  }

  /**
   *
   * @param messageId Optional, defaults to the original message
   * @returns {APIMessage}
   */
  public async getMessage(messageId?: string) {
    return messageId ? this.client.rest.interaction.getFollowupMessage(this.client.applicationId!, this.data.token, messageId) : this.client.rest.interaction.getOriginalInteractionResponse(this.client.applicationId!, this.data.token);
  }

  /**
   *
   * @param messageId Optional, defaults to the original message
   * @returns {APIMessage}
   */
  public async updateMessage(message: RESTPatchAPIInteractionOriginalResponseJSONBody & {
    files?: Array<{
      name: string;
      file: Buffer | import("stream").Readable | import("stream/web").ReadableStream;
    }>;
  }, messageId?: string) {
    return messageId ? this.client.rest.interaction.editFollowupMessage(this.client.applicationId!, this.data.token, messageId, message) : this.client.rest.interaction.editOriginalInteractionResponse(this.client.applicationId!, this.data.token, message)
  }

  /**
   *
   * @param messageId Optional, defaults to @original
   * @returns {unknown}
   */
  public async deleteMessage(messageId?: string) {
    return messageId ? this.client.rest.interaction.deleteFollowupMessage(this.client.applicationId!, this.data.token, messageId) : this.client.rest.interaction.deleteOriginalInteractionResponse(this.client.applicationId!, this.data.token);
  }

  public async followUp(message: RESTPostAPIInteractionFollowupJSONBody & {
    files?: Array<{
      name: string;
      file: Buffer | import("stream").Readable | import("stream/web").ReadableStream;
    }>;
  }) {
    return this.client.rest.interaction.createFollowupMessage(this.client.applicationId!, this.data.token, message)
  }
}
