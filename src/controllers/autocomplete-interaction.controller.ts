/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AutocompleteInteractionControllerSettings } from './types';
import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';

export class AutocompleteInteractionController extends BaseController<APIApplicationCommandAutocompleteInteraction> {
  option: AutocompleteInteractionControllerSettings['option'];
  commandName: string;
  constructor(settings: AutocompleteInteractionControllerSettings) {
    super();
    this.option = settings.option;
    this.commandName = settings.commandName;
  }

  handler(context: BaseContext<APIApplicationCommandAutocompleteInteraction>): unknown {
    throw new Error('Method not implemented');
  }
}
