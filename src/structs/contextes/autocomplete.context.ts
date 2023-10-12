import { BaseContext } from '@lib/base/base.context';
import { autocomplete } from '@lib/contextes/functions';
import { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';

export class AutocompleteContext extends BaseContext<APIApplicationCommandAutocompleteInteraction> {
  public autocomplete = autocomplete.bind(this);
}
