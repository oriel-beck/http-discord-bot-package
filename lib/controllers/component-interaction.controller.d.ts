import type { ComponentInteractionControllerSettings } from './types';
import type { APIMessageComponentInteraction } from 'discord-api-types/v10';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';
export declare class ComponentInteractionController extends BaseController<APIMessageComponentInteraction> {
    componentType: ComponentInteractionControllerSettings['componentType'];
    constructor(settings: ComponentInteractionControllerSettings);
    handler(context: BaseContext<APIMessageComponentInteraction>): unknown;
}
//# sourceMappingURL=component-interaction.controller.d.ts.map