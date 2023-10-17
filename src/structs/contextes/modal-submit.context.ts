import { BaseContext } from '@lib/base';
import { type APIInteractionResponseCallbackData, type APIModalSubmitDMInteraction, type APIModalSubmitGuildInteraction, type APIModalSubmitInteraction, InteractionResponseType } from 'discord-api-types/v10';

export class ModalSubmitContext extends BaseContext<APIModalSubmitInteraction | APIModalSubmitDMInteraction | APIModalSubmitGuildInteraction> {
  async update(message: APIInteractionResponseCallbackData) {
    return await this.client.rest.interaction.createInteractionResponse(this.client.applicationId!, this.data.token, {
      type: InteractionResponseType.UpdateMessage,
      data: message
    });
  }
}
