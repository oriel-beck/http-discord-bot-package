import { HttpBotClientOptions } from '@src/structs/client';
import { verifyKey } from 'discord-interactions';
import { readFileSync } from 'fs';
import { IncomingMessage } from 'http';
import { dirname, join } from 'path';

let rootPath: string | null = null;
export function getRootPath(): string {
  if (rootPath !== null) return rootPath;

  const cwd = process.cwd();

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const file: { main?: string } = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
    if (!file.main) throw new Error('Please specify a "main" property in your "package.json" pointing at your main file.');
    rootPath = dirname(join(cwd, file.main));
  } catch {
    rootPath = cwd;
  }

  return rootPath; // Return the rootPath directly without converting it to a URL
}
export interface RootData {
  root: string;
  type: 'ESM' | 'CommonJS';
}

export type ValueOf<T> = T[keyof T];

export const joinRoute = (...parts: string[]) => parts.join('/');

export function verifyRequest(publicKey: string, req: IncomingMessage, buffer: Buffer) {
  if (req.headers['content-type'] !== 'application/json') return false;

  const signature = req.headers['x-signature-ed25519'] as string | undefined;
  if (!signature) return false;

  const timestamp = req.headers['x-signature-timestamp'] as string | undefined;
  if (!timestamp) return false;

  const isValidRequest = verifyKey(buffer, signature, timestamp, publicKey);
  if (!isValidRequest) return false;
  return true;
}

export function validateOptions(opts: HttpBotClientOptions) {
  if (opts.botToken && opts.botToken.split('.').length != 3) throw new Error(`"${opts.botToken}" is not a valid bot token.`);
  if (opts.defaultRoute && typeof opts.defaultRoute !== 'function') throw throwIncorrectConfigError('defaultRoute', 'function', typeof opts.defaultRoute);
  if (opts.djsRestOptions && typeof opts.djsRestOptions !== 'object') throw throwIncorrectConfigError('djsRestOptions', 'object', typeof opts.djsRestOptions);
  if (opts.host && typeof opts.host !== 'string') throw throwIncorrectConfigError('host', 'string', typeof opts.host);
  if (opts.port && typeof opts.port !== 'number') throw throwIncorrectConfigError('port', 'number', typeof opts.port);
  if (opts.publicKey && typeof opts.publicKey !== 'string') throw throwIncorrectConfigError('publicKey', 'string', typeof opts.publicKey);
  if (opts.routerOptions && typeof opts.routerOptions !== 'object') throw throwIncorrectConfigError('routerOptions', 'object', typeof opts.routerOptions);
  if (opts.loggerOptions && typeof opts.loggerOptions !== 'object') throw throwIncorrectConfigError('loggerOptions', 'object', typeof opts.routerOptions);
}

const throwIncorrectConfigError = (opt: string, type: string, got: string) => new Error(`Expected "${opt}" to be type of "${type}", received "${got}".`);
