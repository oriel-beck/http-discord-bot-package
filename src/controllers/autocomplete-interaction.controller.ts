import type { AutocompleteInteractionControllerSettings } from './types';
import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import { AutocompleteContext } from '../structs/contextes';
import { BaseController } from '@lib/base/base.controller';

export abstract class AutocompleteInteractionController extends BaseController<APIApplicationCommandAutocompleteInteraction> {
  option!: AutocompleteInteractionControllerSettings['option'];
  commandName!: string;
  constructor(settings: AutocompleteInteractionControllerSettings) {
    super();
    this.option = settings?.option || this?.option;
    this.commandName = settings?.commandName || this?.commandName;
  }

  abstract handler(context: AutocompleteContext): never;
}
