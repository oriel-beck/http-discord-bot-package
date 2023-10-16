import type { APIModalSubmitInteraction } from 'discord-api-types/v10';
import type { ModalSubmitInteractionControllerSettings } from './types';
import { BaseController } from '@lib/base';
import { ModalSubmitContext } from '@src/structs/contextes';

export abstract class ModalSubmitInteractionController extends BaseController<APIModalSubmitInteraction> {
  customId?: string;
  constructor(settings?: ModalSubmitInteractionControllerSettings) {
    super();
    this.customId = settings?.customId;
  }

  abstract handler(context: ModalSubmitContext): unknown;
}
