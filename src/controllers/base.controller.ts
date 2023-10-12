import type { APIInteraction } from 'discord-api-types/v10';
import type { BaseContext } from '../structs/contextes/base.context';

export abstract class BaseController<T extends APIInteraction> {
  abstract handler(context: BaseContext<T>): never;
}
