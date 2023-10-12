/// <reference types="node" />
/// <reference types="node" />
import { HttpBotClientOptions } from '@src/structs/client';
import { IncomingMessage } from 'http';
export declare function getRootPath(): string;
export interface RootData {
    root: string;
    type: 'ESM' | 'CommonJS';
}
export type ValueOf<T> = T[keyof T];
export declare const joinRoute: (...parts: string[]) => string;
export declare function verifyRequest(publicKey: string, req: IncomingMessage, buffer: Buffer): boolean;
export declare function validateOptions(opts: HttpBotClientOptions): void;
//# sourceMappingURL=util.d.ts.map