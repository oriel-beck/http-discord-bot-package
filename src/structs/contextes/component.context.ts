import { ModalBuilder } from '@discordjs/builders';
import { BaseContext } from '@lib/base/base.context';
import { type APIMessageComponentInteraction, InteractionResponseType } from 'discord-api-types/v10';

export class ComponentContext extends BaseContext<APIMessageComponentInteraction> {
  async deferWithoutSource() {
    return await this.interactionCallback(InteractionResponseType.DeferredMessageUpdate);
  }

  async createModal(modal: ModalBuilder) {
    return await this.interactionCallback(InteractionResponseType.Modal, modal.toJSON());
  }
}
