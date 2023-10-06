import { readFileSync } from 'fs';
import { dirname, join } from 'path';

let rootPath: string | null = null;
export function getRootPath(): string {
    if (rootPath !== null) return rootPath;

    const cwd = process.cwd();

    try {
        const file = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
        rootPath = dirname(join(cwd, file.main));
    } catch {
        rootPath = cwd
    }

    return rootPath;
}

export interface RootData {
    root: string;
    type: 'ESM' | 'CommonJS';
}

export type ValueOf<T> = T[keyof T];
