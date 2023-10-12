import type { APIModalSubmitInteraction } from 'discord-api-types/v10';
import type { ModalSubmitInteractionControllerSettings } from './types';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';
export declare class ModalSubmitInteractionController extends BaseController<APIModalSubmitInteraction> {
    customId: string;
    constructor(settings?: ModalSubmitInteractionControllerSettings);
    handler(context: BaseContext<APIModalSubmitInteraction>): unknown;
}
//# sourceMappingURL=modal-submit-interaction.controller.d.ts.map