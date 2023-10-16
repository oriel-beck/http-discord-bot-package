import { ModalBuilder } from '@discordjs/builders';
import { BaseContext } from '@lib/base/base.context';
import { InteractionResponseType, type APIApplicationCommandInteraction, ApplicationCommandOptionType, ApplicationCommandType, APIApplicationCommandInteractionDataBasicOption } from 'discord-api-types/v10';

export class ApplicationCommandContext<T extends APIApplicationCommandInteraction = APIApplicationCommandInteraction> extends BaseContext<T> {
  async createModal(modal: ModalBuilder) {
    return await this.interactionCallback(InteractionResponseType.Modal, modal.toJSON());
  }

  getValue<T>(type: ApplicationCommandOptionType, name: string): T | undefined {
    if (this.data.data.type !== ApplicationCommandType.ChatInput) throw new Error("This cannot be used in non chat input interactions");
    return (this.data.data.options?.find((opt) => opt.type === type && opt.name === name) as APIApplicationCommandInteractionDataBasicOption)?.value as T;
  }
}
