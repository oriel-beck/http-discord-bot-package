import { readFileSync } from 'fs';
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

  return rootPath;
}

export interface RootData {
  root: string;
  type: 'ESM' | 'CommonJS';
}

export type ValueOf<T> = T[keyof T];
