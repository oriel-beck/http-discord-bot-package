import type { AutocompleteInteractionControllerSettings } from './types';
import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';

export abstract class AutocompleteInteractionController extends BaseController<APIApplicationCommandAutocompleteInteraction> {
  option!: AutocompleteInteractionControllerSettings['option'];
  commandName!: string;
  constructor(settings: AutocompleteInteractionControllerSettings) {
    super();
    this.option = settings?.option || this?.option;
    this.commandName = settings?.commandName || this?.commandName;
  }

  abstract handler(context: BaseContext<APIApplicationCommandAutocompleteInteraction>): never;
}
