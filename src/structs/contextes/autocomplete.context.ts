import { BaseContext } from '@lib/base/base.context';
import { APIApplicationCommandAutocompleteInteraction, InteractionResponseType } from 'discord-api-types/v10';

export class AutocompleteContext extends BaseContext<APIApplicationCommandAutocompleteInteraction> {
  async autocomplete(choices: { name: string; value: string }[]) {
    if (choices.length > 25) throw new Error('[autocomplete]: Cannot send over 25 choices!');
    return await this.interactionCallback(InteractionResponseType.ApplicationCommandAutocompleteResult, { choices });
  }
}
