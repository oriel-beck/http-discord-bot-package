import type { ComponentType } from 'discord-api-types/v10';
import type { RouteSettingsMode, ValueOf } from '../util';
import type { ApplicationCommandController } from './application-command.controller';
import type { ComponentInteractionController } from './component-interaction.controller';
import type { AutocompleteInteractionController } from './autocomplete-interaction.controller';
import type { ModalSubmitInteractionController } from './modal-submit-interaction.controller';

export interface BaseControllerSettings {
  name?: string;
  routeSettings?: RouteSettings;
}

export interface ComponentInteractionControllerSettings extends BaseControllerSettings {
  componentType: Omit<ComponentType, 'ActionRow'>;
}

export interface AutocompleteInteractionControllerSettings extends BaseControllerSettings {
  option: string;
}

export interface RouteSettings {
  route: string;
  mode?: ValueOf<typeof RouteSettingsMode>;
}

export type AnyController =
  | ApplicationCommandController
  | ComponentInteractionController
  | AutocompleteInteractionController
  | ModalSubmitInteractionController;
