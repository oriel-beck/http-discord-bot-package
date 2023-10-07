/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IncomingMessage, ServerResponse } from 'http';
import type { ComponentInteractionControllerSettings } from './types';
import type { APIMessageComponentInteraction } from 'discord-api-types/v10';
import { BaseController } from './base.controller';

export class ComponentInteractionController extends BaseController {
  componentType: ComponentInteractionControllerSettings['componentType'];
  constructor(settings: ComponentInteractionControllerSettings) {
    super(settings);
    this.componentType = settings.componentType;
  }

  handler(
    // @ts-expect-error no unused vars
    req: IncomingMessage,
    // @ts-expect-error no unused vars
    res: ServerResponse<IncomingMessage>,
    // @ts-expect-error no unused vars
    params: Record<string, string | undefined>,
    // @ts-expect-error no unused vars
    data: APIMessageComponentInteraction,
  ): unknown {
    throw new Error('Method not implemented');
  }
}
