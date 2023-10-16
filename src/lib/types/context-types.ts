import type { RawFile } from '@discordjs/rest';
import type { Client } from '@src/structs/clients';
import type { APIInteraction } from 'discord-api-types/v10';

export type MessagePayload<T> = T & { attachments?: RawFile[] };
export interface ThisContext<T extends APIInteraction> {
  data: T;
  client: Client;
}
