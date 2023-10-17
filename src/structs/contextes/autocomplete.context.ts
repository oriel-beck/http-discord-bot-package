import { BaseContext } from '@lib/base/base.context';
import { type APIApplicationCommandAutocompleteInteraction, type APIApplicationCommandOptionChoice, InteractionResponseType } from 'discord-api-types/v10';

export class AutocompleteContext extends BaseContext<APIApplicationCommandAutocompleteInteraction> {
  async autocomplete(choices: APIApplicationCommandOptionChoice[]) {
    if (choices.length > 25) throw new Error('[autocomplete]: Cannot send over 25 choices!');
    return await this.client.rest.interaction.createInteractionResponse(this.client.applicationId!, this.data.token, {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: { choices }
    })
  }
}
