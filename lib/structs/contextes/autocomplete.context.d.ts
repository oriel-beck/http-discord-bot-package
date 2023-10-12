import { BaseContext } from '@lib/base/base.context';
import { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
export declare class AutocompleteContext extends BaseContext<APIApplicationCommandAutocompleteInteraction> {
    autocomplete: (choices: {
        name: string;
        value: string;
    }[]) => Promise<unknown>;
}
//# sourceMappingURL=autocomplete.context.d.ts.map