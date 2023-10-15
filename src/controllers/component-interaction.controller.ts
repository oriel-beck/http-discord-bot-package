import { BaseController } from '@lib/base';
import type { ComponentInteractionControllerSettings } from './types';
import type { APIMessageComponentInteraction } from 'discord-api-types/v10';
import { ComponentContext } from '@src/structs/contextes';

export abstract class ComponentInteractionController extends BaseController<APIMessageComponentInteraction> {
  componentType!: ComponentInteractionControllerSettings['componentType'];
  customId?: string;
  constructor(settings: ComponentInteractionControllerSettings) {
    super();
    this.componentType = settings?.componentType;
  }

  abstract handler(context: ComponentContext): unknown;
}
