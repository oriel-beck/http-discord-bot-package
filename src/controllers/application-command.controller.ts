/* eslint-disable @typescript-eslint/no-unused-vars */
import { APIApplicationCommandInteraction, ApplicationCommandType } from 'discord-api-types/v10';
import type { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';
import { ApplicationCommandControllerSettings } from './types';

export class ApplicationCommandController extends BaseController<APIApplicationCommandInteraction> {
  type: ApplicationCommandType = ApplicationCommandType.ChatInput;
  constructor(settings: ApplicationCommandControllerSettings) {
    super();
    this.type = settings?.type || ApplicationCommandType.ChatInput;
  }
  // eslint-disable-next-line
  handler(context: BaseContext<APIApplicationCommandInteraction>): unknown {
    throw new Error('Method not implemented');
  }

  register(): SlashCommandBuilder | ContextMenuCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | void {}
  // TODO: add a registry method to get all the data needed to register the command
}
