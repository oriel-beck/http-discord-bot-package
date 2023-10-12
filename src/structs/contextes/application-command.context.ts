import { BaseContext } from '@lib/base/base.context';
import { createModal } from '@lib/contextes/functions';
import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';

export class ApplicationCommandContext extends BaseContext<APIApplicationCommandInteraction> {
  public createModal = createModal.bind(this);
}
