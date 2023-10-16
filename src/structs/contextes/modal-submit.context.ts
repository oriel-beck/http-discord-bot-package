import { BaseContext } from '@lib/base';
import { MessagePayload } from '@lib/types';
import { APIInteractionResponseUpdateMessage, APIModalSubmitDMInteraction, APIModalSubmitGuildInteraction, APIModalSubmitInteraction, InteractionResponseType } from 'discord-api-types/v10';

export class ModalSubmitContext extends BaseContext<APIModalSubmitInteraction | APIModalSubmitDMInteraction | APIModalSubmitGuildInteraction> {
    async update(message: MessagePayload<APIInteractionResponseUpdateMessage['data']>) {
        return await this.interactionCallback(InteractionResponseType.UpdateMessage, message);
      }
}
