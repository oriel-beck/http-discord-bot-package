/* eslint-disable @typescript-eslint/no-unused-vars */
import type { APIApplicationCommand, APIApplicationCommandInteraction } from 'discord-api-types/v10';
import type { IncomingMessage, ServerResponse } from 'http';
import { BaseController } from './base.controller';

export class ApplicationCommandController extends BaseController {
  // eslint-disable-next-line
  handler(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    params: Record<string, string | undefined>,
    data: APIApplicationCommandInteraction,
  ): unknown {
    throw new Error('Method not implemented');
  }
  // TODO: add a registry method to get all the data needed to register the command
}
