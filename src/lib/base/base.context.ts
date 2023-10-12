import { APIInteraction } from 'discord-api-types/v10';
import { HttpOnlyBot } from '../../structs/client';
import { deferWithSource, deleteMessage, followUp, getMessage, reply, updateMessage } from '../contextes/functions';

export class BaseContext<T extends APIInteraction> {
  params: {
    [k: string]: string | undefined;
  } = {};
  constructor(
    public data: T,
    public client: HttpOnlyBot,
  ) {}
  public reply = reply.bind(this);
  public deferWithSource = deferWithSource.bind(this);
  public getMessage = getMessage.bind(this);
  public updateMessage = updateMessage.bind(this);
  public deleteMessage = deleteMessage.bind(this);
  public followUp = followUp.bind(this);
}
