/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModalBuilder } from '@discordjs/builders';
import { REST, RawFile } from '@discordjs/rest';
import {
  APIInteraction,
  APIInteractionResponseChannelMessageWithSource,
  APIInteractionResponseUpdateMessage,
  APIMessage,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  Routes,
} from 'discord-api-types/v10';
import { HttpOnlyBot } from '../client';

type MessagePayload<T> = T & { attachments?: RawFile[] };
const cannotUseError = 'This interaction type cannot use this';

export class BaseContext<T extends APIInteraction> {
  params: {
    [k: string]: string | undefined;
  } = {};
  constructor(
    public data: T,
    public client: HttpOnlyBot,
  ) {}
  async reply(message: MessagePayload<APIInteractionResponseChannelMessageWithSource['data']>) {
    const files = message.attachments;
    delete message.attachments;
    return await this.client.rest.post(Routes.interactionCallback(this.data.id, this.data.token), {
      files,
      body: {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          ...message,
        },
      },
    });
  }

  async deferWithSource(ephemeral: boolean) {
    return await this.interactionCallback(InteractionResponseType.DeferredChannelMessageWithSource, { flags: ephemeral ? MessageFlags.Ephemeral : undefined });
  }

  async deferUpdate() {
    if (this.data.type !== InteractionType.MessageComponent && this.data.type !== InteractionType.ModalSubmit) throw new Error(cannotUseError);
    return await this.interactionCallback(InteractionResponseType.DeferredMessageUpdate);
  }

  async createModal(modal: ModalBuilder) {
    if (this.data.type === InteractionType.ModalSubmit) throw new Error(cannotUseError);
    return await this.interactionCallback(InteractionResponseType.Modal, modal.toJSON());
  }

  // TODO: figure out input for this
  async autocomplete(choices: ({ name: string, value: string })[]) {
    if (this.data.type !== InteractionType.ApplicationCommandAutocomplete) throw new Error(cannotUseError);
    if (choices.length > 25) throw new Error("[autocomplete]: Cannot send over 25 choices!");
    return await this.interactionCallback(InteractionResponseType.ApplicationCommandAutocompleteResult, { choices });
  }

  /**
   *
   * @param messageId Optional, defaults to @original
   * @returns {APIMessage}
   */
  async getMessage(messageId?: string) {
    return await this.client.rest.get(Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
  }

  /**
   *
   * @param messageId Optional, defaults to @original
   * @returns {APIMessage}
   */
  async updateMessage(message: MessagePayload<APIInteractionResponseUpdateMessage>, messageId?: string) {
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
  async deleteMessage(messageId?: string) {
    return await this.client.rest.delete(Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
  }

  async followUp(message: MessagePayload<APIInteractionResponseChannelMessageWithSource>) {
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

  // TODO: add premium required when available

  private interactionCallback(type: InteractionResponseType, data?: unknown) {
    return this.client.rest.post(Routes.interactionCallback(this.data.id, this.data.token), {
      body: {
        type,
        data,
      },
    });
  }
}
