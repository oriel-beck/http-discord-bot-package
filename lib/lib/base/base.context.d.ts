import { APIInteraction } from 'discord-api-types/v10';
import { HttpOnlyBot } from '../../structs/client';
export declare class BaseContext<T extends APIInteraction> {
    data: T;
    client: HttpOnlyBot;
    params: {
        [k: string]: string | undefined;
    };
    constructor(data: T, client: HttpOnlyBot);
    reply: (message: import("../types/context-types").MessagePayload<import("discord-api-types/v10").APIInteractionResponseCallbackData>, returnReply?: boolean | undefined) => Promise<unknown>;
    deferWithSource: (ephemeral: boolean) => Promise<unknown>;
    getMessage: (messageId?: string | undefined) => Promise<unknown>;
    updateMessage: (message: import("../types/context-types").MessagePayload<import("discord-api-types/v10").APIInteractionResponseUpdateMessage>, messageId?: string | undefined) => Promise<unknown>;
    deleteMessage: (messageId?: string | undefined) => Promise<unknown>;
    followUp: (message: import("../types/context-types").MessagePayload<import("discord-api-types/v10").APIInteractionResponseChannelMessageWithSource>) => Promise<unknown>;
}
//# sourceMappingURL=base.context.d.ts.map