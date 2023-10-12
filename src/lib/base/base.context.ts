import { APIInteraction, APIInteractionResponseChannelMessageWithSource, APIInteractionResponseUpdateMessage, InteractionResponseType, MessageFlags, Routes } from 'discord-api-types/v10';
import { HttpOnlyBot } from '@src/structs/client';
import { MessagePayload } from '@lib/types';

export class BaseContext<T extends APIInteraction> {
  params: {
    [k: string]: string | undefined;
  } = {};
  constructor(
    public data: T,
    public client: HttpOnlyBot,
  ) { }

  public interactionCallback(type: InteractionResponseType, data?: unknown): unknown {
    return this.client.rest.post(Routes.interactionCallback(this.data.id, this.data.token), {
      body: {
        type,
        data,
      },
    });
  }

  public async reply(
    message: MessagePayload<APIInteractionResponseChannelMessageWithSource['data']>,
    returnReply = false,
  ) {
    const files = message.attachments;
    delete message.attachments;
    await this.client.rest.post(Routes.interactionCallback(this.data.id, this.data.token), {
      files,
      body: {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          ...message,
        },
      },
    });
    if (returnReply) return await this.getMessage();
  }

  public async deferWithSource(ephemeral: boolean) {
    return await this.interactionCallback(InteractionResponseType.DeferredChannelMessageWithSource, {
      flags: ephemeral ? MessageFlags.Ephemeral : undefined,
    });
  }

  /**
 *
 * @param messageId Optional, defaults to the original message
 * @returns {APIMessage}
 */
  public async getMessage(messageId?: string) {
    return await this.client.rest.get(Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
  }

  /**
   *
   * @param messageId Optional, defaults to the original message
   * @returns {APIMessage}
   */
  public async updateMessage(
    message: MessagePayload<APIInteractionResponseUpdateMessage>,
    messageId?: string,
  ) {
    const files = message.attachments;
    delete message.attachments;
    return await this.client.rest.patch(Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'), {
      files,
      body: {
        data: {
          ...message,
        },
      },
    });
  }

  /**
   *
   * @param messageId Optional, defaults to @original
   * @returns {unknown}
   */
  public async deleteMessage(messageId?: string) {
    return await this.client.rest.delete(Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
  }

  public async followUp(message: MessagePayload<APIInteractionResponseChannelMessageWithSource>) {
    const files = message.attachments;
    delete message.attachments;
    return await this.client.rest.post(Routes.webhook(this.client.applicationId, this.data.token), {
      body: {
        files,
        data: {
          ...message,
        },
      },
    });
  }
}
