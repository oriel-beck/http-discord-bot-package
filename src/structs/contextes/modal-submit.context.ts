import { APIModalSubmitDMInteraction, APIModalSubmitGuildInteraction, APIModalSubmitInteraction } from 'discord-api-types/v10';
import { BaseContext } from '../../lib/base/base.context';

export class ModalSubmitContext extends BaseContext<APIModalSubmitInteraction | APIModalSubmitDMInteraction | APIModalSubmitGuildInteraction> {}
