import type { AutocompleteInteractionControllerSettings } from './types';
import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import { AutocompleteContext } from '../structs/contextes';
import { BaseController } from '@lib/base/base.controller';
export declare abstract class AutocompleteInteractionController extends BaseController<APIApplicationCommandAutocompleteInteraction> {
    option: AutocompleteInteractionControllerSettings['option'];
    commandName: string;
    constructor(settings: AutocompleteInteractionControllerSettings);
    abstract handler(context: AutocompleteContext): never;
}
//# sourceMappingURL=autocomplete-interaction.controller.d.ts.map