/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IncomingMessage, ServerResponse } from 'http';
import type { AutocompleteInteractionControllerSettings } from './types';
import type { APICommandAutocompleteInteractionResponseCallbackData } from 'discord-api-types/v10';
import { BaseController } from './base.controller';

export class AutocompleteInteractionController extends BaseController {
  option: AutocompleteInteractionControllerSettings['option'];
  commandName: string;
  constructor(settings: AutocompleteInteractionControllerSettings) {
    super();
    this.option = settings.option;
    this.commandName = settings.commandName;
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
