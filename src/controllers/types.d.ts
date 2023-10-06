import { ComponentType } from "discord-api-types/v10";
import type { RouteSettingsMode, ValueOf } from "../util/constants.js";
import { ApplicationCommandController, AutocompleteInteractionController, ComponentInteractionController, ModalSubmitInteractionController } from "./controller.ts";

export interface BaseControllerSettings {
    name?: string;
    routeSettings?: RouteSettings;
}

export interface ComponentInteractionControllerSettings extends BaseControllerSettings {
    componentType: Omit<ComponentType, "ActionRow">;
}

export interface AutocompleteInteractionControllerSettings extends BaseControllerSettings {
    option: string;
}

export interface RouteSettings {
    route: string;
    mode?: ValueOf<typeof RouteSettingsMode>;
}

export type AnyController = ApplicationCommandController | ComponentInteractionController | AutocompleteInteractionController | ModalSubmitInteractionController;
