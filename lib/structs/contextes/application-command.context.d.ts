import { BaseContext } from '@lib/base/base.context';
import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';
export declare class ApplicationCommandContext extends BaseContext<APIApplicationCommandInteraction> {
    createModal: (modal: import("@discordjs/builders").ModalBuilder) => Promise<unknown>;
}
//# sourceMappingURL=application-command.context.d.ts.map