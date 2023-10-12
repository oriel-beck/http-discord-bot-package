import type { APIInteraction } from 'discord-api-types/v10';
import type { BaseContext } from './base.context';
export declare abstract class BaseController<T extends APIInteraction> {
    abstract handler(context: BaseContext<T>): never;
}
//# sourceMappingURL=base.controller.d.ts.map