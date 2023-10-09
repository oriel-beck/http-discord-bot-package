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

export function verifyRequest(req: IncomingMessage, buffer: Buffer) {
  if (req.headers['content-type'] !== 'application/json') return false;

  const signature = req.headers['x-signature-ed25519'] as string | undefined;
  if (!signature) return false;

  const timestamp = req.headers['x-signature-timestamp'] as string | undefined;
  if (!timestamp) return false;

  const isValidRequest = verifyKey(buffer, signature, timestamp, process.env.APPLICATION_PUBLIC_KEY!);
  if (!isValidRequest) return false;
  return true;
}
