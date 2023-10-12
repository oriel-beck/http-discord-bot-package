import type { ComponentInteractionControllerSettings } from './types';
import type { APIMessageComponentInteraction } from 'discord-api-types/v10';
import { BaseController } from '../lib/base/base.controller';
import { ComponentContext } from '../structs/contextes';

export abstract class ComponentInteractionController extends BaseController<APIMessageComponentInteraction> {
  componentType!: ComponentInteractionControllerSettings['componentType'];
  constructor(settings: ComponentInteractionControllerSettings) {
    super();
    this.componentType = settings?.componentType || this?.componentType;
  }

  abstract handler(context: ComponentContext): never;
}
