import { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import type { ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { ApplicationCommandContext } from '../structs/contextes';
import { BaseController } from '@lib/base/base.controller';
import { ApplicationCommandControllerSettings, Subcommands } from './types';

export abstract class ApplicationCommandController<T extends APIApplicationCommandInteraction = APIApplicationCommandInteraction> extends BaseController<T> {
  subcommands: Subcommands = {};
  constructor(settings: ApplicationCommandControllerSettings) {
    super();
    this.subcommands = settings?.subcommands;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handler(context: ApplicationCommandContext<T>): unknown {
    return;
  }
  abstract register():
    | SlashCommandBuilder
    | ContextMenuCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder;
}
