/* eslint-disable @typescript-eslint/no-unused-vars */
import { APIApplicationCommandInteraction, ApplicationCommandType } from 'discord-api-types/v10';
import type { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';

export abstract class ApplicationCommandController extends BaseController<APIApplicationCommandInteraction> {
  abstract handler(context: BaseContext<APIApplicationCommandInteraction>): never;
  abstract register(): SlashCommandBuilder | ContextMenuCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
}
