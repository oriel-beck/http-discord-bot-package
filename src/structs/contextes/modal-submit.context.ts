import { BaseContext } from '@lib/base';
import { APIModalSubmitDMInteraction, APIModalSubmitGuildInteraction, APIModalSubmitInteraction } from 'discord-api-types/v10';

export class ModalSubmitContext extends BaseContext<APIModalSubmitInteraction | APIModalSubmitDMInteraction | APIModalSubmitGuildInteraction> {}
