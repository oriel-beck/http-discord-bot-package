import type { ComponentType } from 'discord-api-types/v10';
import type { ApplicationCommandController } from './application-command.controller';
import type { ComponentInteractionController } from './component-interaction.controller';
import type { AutocompleteInteractionController } from './autocomplete-interaction.controller';
import type { ModalSubmitInteractionController } from './modal-submit-interaction.controller';

export interface ComponentInteractionControllerSettings {
  /**
   * The component this should support, can support any component except ActionRow and TextInput
   */
  componentType: Omit<ComponentType, 'ActionRow' | 'TextInput'>;
  /**
   * This option accepts a route path in accordance to `find-my-way` documentation.
   */
  customId?: string;
}

export interface AutocompleteInteractionControllerSettings {
  /**
   * The name of the option of the command this autocompletes for.
   */
  option: string;
  /**
   * The command name this autocompletes for.
   */
  commandName: string;
}

export interface ModalSubmitInteractionControllerSettings {
  /**
   * This option accepts a route path in accordance to `find-my-way` documentation.
   */
  customId?: string;
}

export type AnyController =
  | ApplicationCommandController
  | ComponentInteractionController
  | AutocompleteInteractionController
  | ModalSubmitInteractionController;
