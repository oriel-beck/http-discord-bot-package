import { type APIInteraction, type APIInteractionResponseChannelMessageWithSource, type APIInteractionResponseUpdateMessage } from 'discord-api-types/v10';
import type { MessagePayload, ThisContext } from '@lib/types/context-types';
import type { ModalBuilder } from '@discordjs/builders';
export declare function reply<T extends APIInteraction>(this: ThisContext<T>, message: MessagePayload<APIInteractionResponseChannelMessageWithSource['data']>, returnReply?: boolean): Promise<unknown>;
export declare function deferWithSource<T extends APIInteraction>(this: ThisContext<T>, ephemeral: boolean): Promise<unknown>;
export declare function deferWithoutSource<T extends APIInteraction>(this: ThisContext<T>): Promise<unknown>;
export declare function createModal<T extends APIInteraction>(this: ThisContext<T>, modal: ModalBuilder): Promise<unknown>;
export declare function autocomplete<T extends APIInteraction>(this: ThisContext<T>, choices: {
    name: string;
    value: string;
}[]): Promise<unknown>;
/**
 *
 * @param messageId Optional, defaults to the original message
 * @returns {APIMessage}
 */
export declare function getMessage<T extends APIInteraction>(this: ThisContext<T>, messageId?: string): Promise<unknown>;
/**
 *
 * @param messageId Optional, defaults to the original message
 * @returns {APIMessage}
 */
export declare function updateMessage<T extends APIInteraction>(this: ThisContext<T>, message: MessagePayload<APIInteractionResponseUpdateMessage>, messageId?: string): Promise<unknown>;
/**
 *
 * @param messageId Optional, defaults to @original
 * @returns {unknown}
 */
export declare function deleteMessage<T extends APIInteraction>(this: ThisContext<T>, messageId?: string): Promise<unknown>;
export declare function followUp<T extends APIInteraction>(this: ThisContext<T>, message: MessagePayload<APIInteractionResponseChannelMessageWithSource>): Promise<unknown>;
//# sourceMappingURL=functions.d.ts.map