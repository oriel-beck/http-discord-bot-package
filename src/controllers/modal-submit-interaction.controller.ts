/* eslint-disable @typescript-eslint/no-unused-vars */
import type { APICommandAutocompleteInteractionResponseCallbackData } from 'discord-api-types/v10';
import type { IncomingMessage, ServerResponse } from 'http';
import { BaseController } from './base.controller';

export class ModalSubmitInteractionController extends BaseController {
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
