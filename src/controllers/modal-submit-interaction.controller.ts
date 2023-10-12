import type { APIModalSubmitInteraction } from 'discord-api-types/v10';
import type { ModalSubmitInteractionControllerSettings } from './types';
import { BaseController } from '../lib/base/base.controller';
import { ModalSubmitContext } from '../structs/contextes';

export abstract class ModalSubmitInteractionController extends BaseController<APIModalSubmitInteraction> {
  customId!: string;
  constructor(settings?: ModalSubmitInteractionControllerSettings) {
    super();
    this.customId = settings?.customId || this?.customId;
  }
  abstract handler(context: ModalSubmitContext): never;
}
