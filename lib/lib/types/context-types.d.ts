import type { RawFile } from '@discordjs/rest';
import type { HttpOnlyBot } from '../../structs/client';
import type { APIInteraction } from 'discord-api-types/v10';
export type MessagePayload<T> = T & {
    attachments?: RawFile[];
};
export interface ThisContext<T extends APIInteraction> {
    data: T;
    client: HttpOnlyBot;
}
//# sourceMappingURL=context-types.d.ts.map