import { ModalBuilder } from '@discordjs/builders';
import { BaseContext } from '@lib/base/base.context';
import { MessagePayload } from '@lib/types';
import { type APIMessageComponentInteraction, InteractionResponseType, APIInteractionResponseUpdateMessage } from 'discord-api-types/v10';

export class ComponentContext extends BaseContext<APIMessageComponentInteraction> {
  async deferUpdate() {
    return await this.interactionCallback(InteractionResponseType.DeferredMessageUpdate);
  }

  async createModal(modal: ModalBuilder) {
    return await this.interactionCallback(InteractionResponseType.Modal, modal.toJSON());
  }

  async update(message: MessagePayload<APIInteractionResponseUpdateMessage['data']>) {
    return await this.interactionCallback(InteractionResponseType.UpdateMessage, message);
  }
}
