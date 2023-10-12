import type { APIModalSubmitInteraction } from 'discord-api-types/v10';
import type { ModalSubmitInteractionControllerSettings } from './types';
import type { BaseContext } from '../lib/base/base.context';
import { BaseController } from '../lib/base/base.controller';

export abstract class ModalSubmitInteractionController extends BaseController<APIModalSubmitInteraction> {
  customId!: string;
  constructor(settings?: ModalSubmitInteractionControllerSettings) {
    super();
    this.customId = settings?.customId || this?.customId;
  }
  abstract handler(context: BaseContext<APIModalSubmitInteraction>): never;
}
