import { BaseContext } from '@lib/base/base.context';
import type { APIMessageComponentInteraction } from 'discord-api-types/v10';
export declare class ComponentContext extends BaseContext<APIMessageComponentInteraction> {
    deferWithoutSource: () => Promise<unknown>;
    createModal: (modal: import("@discordjs/builders").ModalBuilder) => Promise<unknown>;
}
//# sourceMappingURL=component.context.d.ts.map