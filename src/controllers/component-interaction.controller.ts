/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IncomingMessage, ServerResponse } from 'http';
import type { ComponentInteractionControllerSettings } from './types';
import type { APIMessageComponentInteraction } from 'discord-api-types/v10';
import { BaseController } from './base.controller';

export class ComponentInteractionController extends BaseController {
  componentType: ComponentInteractionControllerSettings['componentType'];
  constructor(settings: ComponentInteractionControllerSettings) {
    super();
    this.componentType = settings.componentType;
  }

  handler(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    params: Record<string, string | undefined>,
    data: APIMessageComponentInteraction,
  ): unknown {
    throw new Error('Method not implemented');
  }
}
