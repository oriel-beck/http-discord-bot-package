import { BaseContext } from '@lib/base';
import {
  type APIInteractionResponseCallbackData,
  type APIModalSubmitDMInteraction,
  type APIModalSubmitGuildInteraction,
  type APIModalSubmitInteraction,
  InteractionResponseType,
} from 'discord-api-types/v10';
export type AnyModalSubmitInteraction = APIModalSubmitInteraction | APIModalSubmitDMInteraction | APIModalSubmitGuildInteraction;
export class ModalSubmitContext<T extends AnyModalSubmitInteraction = AnyModalSubmitInteraction> extends BaseContext<T> {
  async update(message: APIInteractionResponseCallbackData) {
    return await this.client.rest.interaction.createInteractionResponse(this.client.applicationId!, this.data.token, {
      type: InteractionResponseType.UpdateMessage,
      data: message,
    });
  }
}
