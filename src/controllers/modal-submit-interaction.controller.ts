/* eslint-disable @typescript-eslint/no-unused-vars */
import type { APIModalSubmitInteraction } from 'discord-api-types/v10';
import type { ModalSubmitInteractionControllerSettings } from './types';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';

export class ModalSubmitInteractionController extends BaseController<APIModalSubmitInteraction> {
  customId?: string;
  constructor(settings?: ModalSubmitInteractionControllerSettings) {
    super();
    this.customId = settings?.customId;
  }
  handler(context: BaseContext<APIModalSubmitInteraction>): unknown {
    throw new Error('Method not implemented');
  }
}
