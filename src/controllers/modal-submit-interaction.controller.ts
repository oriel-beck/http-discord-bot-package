/* eslint-disable @typescript-eslint/no-unused-vars */
import type { APICommandAutocompleteInteractionResponseCallbackData } from 'discord-api-types/v10';
import type { IncomingMessage, ServerResponse } from 'http';
import { BaseController } from './base.controller';
import { ModalSubmitInteractionControllerSettings } from './types';

export class ModalSubmitInteractionController extends BaseController {
  customId: string;
  constructor(settings: ModalSubmitInteractionControllerSettings) {
    super();
    this.customId = settings.customId;
  }
  handler(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    params: Record<string, string | undefined>,
    data: APICommandAutocompleteInteractionResponseCallbackData,
  ): unknown {
    throw new Error('Method not implemented');
  }
}
