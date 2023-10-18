import { ModalBuilder } from '@discordjs/builders';
import { BaseContext } from '@lib/base/base.context';
import { type APIMessageComponentInteraction, type APIInteractionResponseCallbackData, InteractionResponseType } from 'discord-api-types/v10';

export class ComponentContext<T extends APIMessageComponentInteraction = APIMessageComponentInteraction> extends BaseContext<T> {
  async deferUpdate() {
    return await this.client.rest.interaction.createInteractionResponse(this.data.id, this.data.token, {
      type: InteractionResponseType.DeferredMessageUpdate
    });
  }

  async createModal(modal: ModalBuilder) {
    return await this.client.rest.interaction.createInteractionResponse(this.data.id, this.data.token, {
      type: InteractionResponseType.Modal,
      data: modal.toJSON()
    });
  }

  async update(message: APIInteractionResponseCallbackData) {
    return await this.client.rest.interaction.createInteractionResponse(this.data.id, this.data.token, {
      type: InteractionResponseType.UpdateMessage,
      data: message
    });
  }
}
