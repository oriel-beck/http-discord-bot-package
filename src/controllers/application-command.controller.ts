/* eslint-disable @typescript-eslint/no-unused-vars */
import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import type { SlashCommandBuilder } from '@discordjs/builders';
import type { BaseContext } from '../structs/contextes/base.context';
import { BaseController } from './base.controller';

export class ApplicationCommandController extends BaseController<APIApplicationCommandInteraction> {
  // eslint-disable-next-line
  handler(context: BaseContext<APIApplicationCommandInteraction>): unknown {
    throw new Error('Method not implemented');
  }

  register(): SlashCommandBuilder | void {}
  // TODO: add a registry method to get all the data needed to register the command
}
