import type { AutocompleteInteractionControllerSettings } from './types';
import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';
export declare class AutocompleteInteractionController extends BaseController<APIApplicationCommandAutocompleteInteraction> {
    option: AutocompleteInteractionControllerSettings['option'];
    commandName: string;
    constructor(settings: AutocompleteInteractionControllerSettings);
    handler(context: BaseContext<APIApplicationCommandAutocompleteInteraction>): unknown;
}
//# sourceMappingURL=autocomplete-interaction.controller.d.ts.map