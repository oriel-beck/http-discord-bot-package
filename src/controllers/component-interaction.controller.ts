import type { ComponentInteractionControllerSettings } from './types';
import type { APIMessageComponentInteraction } from 'discord-api-types/v10';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';

export abstract class ComponentInteractionController extends BaseController<APIMessageComponentInteraction> {
  componentType!: ComponentInteractionControllerSettings['componentType'];
  constructor(settings: ComponentInteractionControllerSettings) {
    super();
    this.componentType = settings?.componentType || this?.componentType;
  }

  abstract handler(context: BaseContext<APIMessageComponentInteraction>): never;
}
