import type { ComponentInteractionControllerSettings } from './types';
import type { APIMessageComponentInteraction } from 'discord-api-types/v10';
import { BaseController } from '../lib/base/base.controller';
import { ComponentContext } from '../structs/contextes';
export declare abstract class ComponentInteractionController extends BaseController<APIMessageComponentInteraction> {
    componentType: ComponentInteractionControllerSettings['componentType'];
    constructor(settings: ComponentInteractionControllerSettings);
    abstract handler(context: ComponentContext): never;
}
//# sourceMappingURL=component-interaction.controller.d.ts.map