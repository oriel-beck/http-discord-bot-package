import {
  type APIInteraction,
  type APIInteractionResponseChannelMessageWithSource,
  type APIInteractionResponseUpdateMessage,
  InteractionResponseType,
  Routes,
  InteractionType,
  MessageFlags,
} from 'discord-api-types/v10';
import type { MessagePayload, ThisContext } from '@lib/types/context-types';
import type { ModalBuilder } from '@discordjs/builders';

const cannotUseError = 'This interaction type cannot use this';

function interactionCallback(this: ThisContext<APIInteraction>, type: InteractionResponseType, data?: unknown) {
  return this.client.rest.post(Routes.interactionCallback(this.data.id, this.data.token), {
    body: {
      type,
      data,
    },
  });
}

export async function reply<T extends APIInteraction>(
  this: ThisContext<T>,
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
  if (returnReply) return await getMessage.bind(this)();
}

export async function deferWithSource<T extends APIInteraction>(this: ThisContext<T>, ephemeral: boolean) {
  return await interactionCallback.bind(this)(InteractionResponseType.DeferredChannelMessageWithSource, {
    flags: ephemeral ? MessageFlags.Ephemeral : undefined,
  });
}

export async function deferWithoutSource<T extends APIInteraction>(this: ThisContext<T>) {
  if (this.data.type !== InteractionType.MessageComponent && this.data.type !== InteractionType.ModalSubmit) throw new Error(cannotUseError);
  return await interactionCallback.bind(this)(InteractionResponseType.DeferredMessageUpdate);
}

export async function createModal<T extends APIInteraction>(this: ThisContext<T>, modal: ModalBuilder) {
  if (this.data.type === InteractionType.ModalSubmit) throw new Error(cannotUseError);
  return await interactionCallback.bind(this)(InteractionResponseType.Modal, modal.toJSON());
}

export async function autocomplete<T extends APIInteraction>(this: ThisContext<T>, choices: { name: string; value: string }[]) {
  if (this.data.type !== InteractionType.ApplicationCommandAutocomplete) throw new Error(cannotUseError);
  if (choices.length > 25) throw new Error('[autocomplete]: Cannot send over 25 choices!');
  return await interactionCallback.bind(this)(InteractionResponseType.ApplicationCommandAutocompleteResult, { choices });
}

/**
 *
 * @param messageId Optional, defaults to the original message
 * @returns {APIMessage}
 */
export async function getMessage<T extends APIInteraction>(this: ThisContext<T>, messageId?: string) {
  return await this.client.rest.get(Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
}

/**
 *
 * @param messageId Optional, defaults to the original message
 * @returns {APIMessage}
 */
export async function updateMessage<T extends APIInteraction>(
  this: ThisContext<T>,
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
export async function deleteMessage<T extends APIInteraction>(this: ThisContext<T>, messageId?: string) {
  return await this.client.rest.delete(Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
}

export async function followUp<T extends APIInteraction>(this: ThisContext<T>, message: MessagePayload<APIInteractionResponseChannelMessageWithSource>) {
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
