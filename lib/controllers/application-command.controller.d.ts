import { APIApplicationCommandInteraction, ApplicationCommandType } from 'discord-api-types/v10';
import type { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';
import { ApplicationCommandControllerSettings } from './types';
export declare class ApplicationCommandController extends BaseController<APIApplicationCommandInteraction> {
    type: ApplicationCommandType;
    constructor(settings: ApplicationCommandControllerSettings);
    handler(context: BaseContext<APIApplicationCommandInteraction>): unknown;
    register(): SlashCommandBuilder | ContextMenuCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | void;
}
//# sourceMappingURL=application-command.controller.d.ts.map