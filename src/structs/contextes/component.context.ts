import { BaseContext } from '@lib/base/base.context';
import { createModal, deferWithoutSource } from '@lib/contextes/functions';
import type { APIMessageComponentInteraction } from 'discord-api-types/v10';

export class ComponentContext extends BaseContext<APIMessageComponentInteraction> {
  public deferWithoutSource = deferWithoutSource.bind(this);
  public createModal = createModal.bind(this);
}
