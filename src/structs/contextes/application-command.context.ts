import { ModalBuilder } from '@discordjs/builders';
import { BaseContext } from '@lib/base/base.context';
import { InteractionResponseType, type APIApplicationCommandInteraction } from 'discord-api-types/v10';

export class ApplicationCommandContext<T extends APIApplicationCommandInteraction = APIApplicationCommandInteraction> extends BaseContext<T> {
  async createModal(modal: ModalBuilder) {
    return await this.interactionCallback(InteractionResponseType.Modal, modal.toJSON());
  }
}
