import type { IncomingMessage, ServerResponse } from "http";
import type { AutocompleteInteractionControllerSettings, BaseControllerSettings, ComponentInteractionControllerSettings, RouteSettings } from "./types.js";
import { APIApplicationCommandInteraction, APICommandAutocompleteInteractionResponseCallbackData, APIMessageComponentInteraction } from "discord-api-types/v10";

export abstract class BaseController {
    name?: string;
    routeSettings?: RouteSettings;
    constructor(settings: BaseControllerSettings) {
        this.name = settings?.name;
        this.routeSettings = settings?.routeSettings;
    }

    abstract handler(req: IncomingMessage, res: ServerResponse<IncomingMessage>, params: Record<string, string | undefined>, data: unknown): unknown
}

export class ApplicationCommandController extends BaseController {
    handler(req: IncomingMessage, res: ServerResponse<IncomingMessage>, params: Record<string, string | undefined>, data: APIApplicationCommandInteraction): unknown {
        throw new Error("Method not implemented")
    }
}

export class ComponentInteractionController extends BaseController {
    componentType: ComponentInteractionControllerSettings["componentType"];
    constructor(settings: ComponentInteractionControllerSettings) {
        super(settings);
        this.componentType = settings.componentType;
    }

    handler(req: IncomingMessage, res: ServerResponse<IncomingMessage>, params: Record<string, string | undefined>, data: APIMessageComponentInteraction): unknown {
        throw new Error("Method not implemented")
    }
}

export class AutocompleteInteractionController extends BaseController {
    option: AutocompleteInteractionControllerSettings["option"];
    constructor(settings: AutocompleteInteractionControllerSettings) {
        super(settings);
        this.option = settings.option;
    }

    handler(req: IncomingMessage, res: ServerResponse<IncomingMessage>, params: Record<string, string | undefined>, data: APICommandAutocompleteInteractionResponseCallbackData): unknown {
        throw new Error("Method not implemented")
    }
}

export class ModalSubmitInteractionController extends BaseController {
    handler(req: IncomingMessage, res: ServerResponse<IncomingMessage>, params: Record<string, string | undefined>, data: APICommandAutocompleteInteractionResponseCallbackData): unknown {
        throw new Error("Method not implemented")
    }
}