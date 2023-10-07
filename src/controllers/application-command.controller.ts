/* eslint-disable @typescript-eslint/no-unused-vars */
import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import type { IncomingMessage, ServerResponse } from 'http';
import { BaseController } from './base.controller';

export class ApplicationCommandController extends BaseController {
  // eslint-disable-next-line
  handler(
    // @ts-expect-error no unused vars
    req: IncomingMessage,
    // @ts-expect-error no unused vars
    res: ServerResponse<IncomingMessage>,
    // @ts-expect-error no unused vars
    params: Record<string, string | undefined>,
    // @ts-expect-error no unused vars
    data: APIApplicationCommandInteraction,
  ): unknown {
    throw new Error('Method not implemented');
  }
}
