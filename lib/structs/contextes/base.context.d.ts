import { ModalBuilder } from '@discordjs/builders';
import { RawFile } from '@discordjs/rest';
import { APIInteraction, APIInteractionResponseChannelMessageWithSource, APIInteractionResponseUpdateMessage } from 'discord-api-types/v10';
import { HttpOnlyBot } from '../client';
type MessagePayload<T> = T & {
    attachments?: RawFile[];
};
export declare class BaseContext<T extends APIInteraction> {
    data: T;
    client: HttpOnlyBot;
    params: {
        [k: string]: string | undefined;
    };
    constructor(data: T, client: HttpOnlyBot);
    reply(message: MessagePayload<APIInteractionResponseChannelMessageWithSource['data']>, returnReply?: boolean): Promise<unknown>;
    deferWithSource(ephemeral: boolean): Promise<unknown>;
    deferUpdate(): Promise<unknown>;
    createModal(modal: ModalBuilder): Promise<unknown>;
    autocomplete(choices: ({
        name: string;
        value: string;
    })[]): Promise<unknown>;
    /**
     *
     * @param messageId Optional, defaults to the original message
     * @returns {APIMessage}
     */
    getMessage(messageId?: string): Promise<unknown>;
    /**
     *
     * @param messageId Optional, defaults to the original message
     * @returns {APIMessage}
     */
    updateMessage(message: MessagePayload<APIInteractionResponseUpdateMessage>, messageId?: string): Promise<unknown>;
    /**
     *
     * @param messageId Optional, defaults to @original
     * @returns {unknown}
     */
    deleteMessage(messageId?: string): Promise<unknown>;
    followUp(message: MessagePayload<APIInteractionResponseChannelMessageWithSource>): Promise<unknown>;
    private interactionCallback;
}
export {};
//# sourceMappingURL=base.context.d.ts.map