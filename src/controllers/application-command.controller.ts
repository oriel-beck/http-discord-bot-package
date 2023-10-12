import { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import type { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandContext } from '../structs/contextes';
import { BaseController } from '@lib/base/base.controller';

export abstract class ApplicationCommandController extends BaseController<APIApplicationCommandInteraction> {
  abstract handler(context: ApplicationCommandContext): never;
  abstract register(): SlashCommandBuilder | ContextMenuCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
}
