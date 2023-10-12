/// <reference types="node" />
import http, { type IncomingMessage, type ServerResponse } from 'http';
import { type Logger, type LoggerOptions } from 'pino';
import findMyWay from 'find-my-way';
import { REST, type RESTOptions } from '@discordjs/rest';
import SuperMap from '@thunder04/supermap';
import { ApplicationCommandController, AutocompleteInteractionController, ComponentInteractionController, ModalSubmitInteractionController } from '../controllers';
export declare class HttpOnlyBot {
    #private;
    stores: {
        commands: SuperMap<string, ApplicationCommandController>;
        components: SuperMap<string, ComponentInteractionController>;
        modals: SuperMap<string, ModalSubmitInteractionController>;
        autocomplete: SuperMap<string, AutocompleteInteractionController>;
    };
    rest: REST;
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    logger: Logger;
    router: findMyWay.Instance<findMyWay.HTTPVersion.V1>;
    port: number;
    host: string | undefined;
    applicationId: string;
    constructor(opts: HttpBotClientOptions);
    login(callback?: () => unknown): Promise<void>;
    registerCommands(): Promise<void>;
    private initInitialListener;
    private defaultInteractionRoute;
}
export interface HttpBotClientOptions {
    port?: number;
    host?: string;
    publicKey: string;
    botToken: string;
    loggerOptions?: LoggerOptions;
    routerOptions?: findMyWay.Config<findMyWay.HTTPVersion.V1>;
    djsRestOptions?: Partial<RESTOptions>;
    defaultRoute?(req: IncomingMessage, res: ServerResponse<IncomingMessage>): unknown;
}
//# sourceMappingURL=client.d.ts.map