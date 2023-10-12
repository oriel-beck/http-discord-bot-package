import type { APIModalSubmitInteraction } from 'discord-api-types/v10';
import type { ModalSubmitInteractionControllerSettings } from './types';
import { BaseController } from '../lib/base/base.controller';
import { ModalSubmitContext } from '../structs/contextes';
export declare abstract class ModalSubmitInteractionController extends BaseController<APIModalSubmitInteraction> {
    customId: string;
    constructor(settings?: ModalSubmitInteractionControllerSettings);
    abstract handler(context: ModalSubmitContext): never;
}
//# sourceMappingURL=modal-submit-interaction.controller.d.ts.map