/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IncomingMessage, ServerResponse } from 'http';
import type { AutocompleteInteractionControllerSettings } from './types';
import type { APICommandAutocompleteInteractionResponseCallbackData } from 'discord-api-types/v10';
import { BaseController } from './base.controller';

export class AutocompleteInteractionController extends BaseController {
  option: AutocompleteInteractionControllerSettings['option'];
  constructor(settings: AutocompleteInteractionControllerSettings) {
    super(settings);
    this.option = settings.option;
  }

  handler(
    // @ts-expect-error no unused vars
    req: IncomingMessage,
    // @ts-expect-error no unused vars
    res: ServerResponse<IncomingMessage>,
    // @ts-expect-error no unused vars
    params: Record<string, string | undefined>,
    // @ts-expect-error no unused vars
    data: APICommandAutocompleteInteractionResponseCallbackData,
  ): unknown {
    throw new Error('Method not implemented');
  }
}
