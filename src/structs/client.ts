import { join } from 'path';
import http, { type IncomingMessage, type ServerResponse } from 'http';
import pino, { type Logger, type LoggerOptions } from 'pino';
import findMyWay from 'find-my-way';
import { APIInteraction, InteractionResponseType, InteractionType, Routes } from 'discord-api-types/v10';
import { REST, type RESTOptions } from '@discordjs/rest';
import SuperMap from '@thunder04/supermap';

import { loadAutocomplete, loadCommands, loadComponents, loadModals } from '../util/load';
import { ApplicationCommandController } from '../controllers/application-command.controller';
import { ComponentInteractionController } from '../controllers/component-interaction.controller';
import { ModalSubmitInteractionController } from '../controllers/modal-submit-interaction.controller';
import { AutocompleteInteractionController } from '../controllers/autocomplete-interaction.controller';
import { Errors } from './errors/constants';
import { getRootPath, validateOptions, verifyRequest } from '../util/util';
import { BaseContext } from './contextes/base.context';

export class HttpOnlyBot {
  #publicKey: string;

  stores = {
    commands: new SuperMap<string, ApplicationCommandController>(),
    components: new SuperMap<string, ComponentInteractionController>(),
    modals: new SuperMap<string, ModalSubmitInteractionController>(),
    autocomplete: new SuperMap<string, AutocompleteInteractionController>(),
  };
  rest: REST;
  server = http.createServer();
  logger: Logger;
  router: findMyWay.Instance<findMyWay.HTTPVersion.V1>;
  port: number;
  host: string | undefined;
  applicationId: string;

  constructor(opts: HttpBotClientOptions) {
    validateOptions(opts);

    this.logger = pino({
      level: 'debug',
      name: 'http-only-bot',
      ...opts?.loggerOptions,
    });
    this.router = findMyWay({
      defaultRoute: (req, res) => (opts?.defaultRoute ? opts.defaultRoute(req, res) : {}),
      ...opts?.routerOptions,
    });
    this.rest = new REST(opts?.djsRestOptions);
    this.port = opts?.port || 5000;
    this.host = opts?.host;
    this.applicationId = Buffer.from(opts.botToken.split('.').at(0)!, 'base64').toString('ascii');
    this.#publicKey = opts.publicKey;
    this.rest.setToken(opts.botToken);
  }

  async login(callback?: () => unknown) {
    this.logger.debug(`Logging in as ${this.applicationId}`);
    const maindir = getRootPath();

    this.logger.info('Initiating commands');
    let ts = Date.now();
    await loadCommands(this.#publicKey, this.router, join(maindir, 'commands'), 'commands', this.stores.commands);
    this.logger.info(`Initiated commands in ${Date.now() - ts}ms`);

    this.logger.info('Initiating componenets');
    ts = Date.now();
    await loadComponents(this.#publicKey, this.router, join(maindir, 'components'), 'components', this.stores.components);
    this.logger.info(`Initiated components in ${Date.now() - ts}ms`);

    this.logger.info('Initiating modals');
    ts = Date.now();
    await loadModals(this.#publicKey, this.router, join(maindir, 'modals'), 'modals', this.stores.modals);
    this.logger.info(`Initiated modals in ${Date.now() - ts}ms`);

    this.logger.info('Initiating autocomplete');
    ts = Date.now();
    await loadAutocomplete(this.#publicKey, this.router, join(maindir, 'autocomplete'), 'autocomplete', this.stores.autocomplete);
    this.logger.info(`Initiated autocomplete in ${Date.now() - ts}ms`);

    this.logger.info('Initiating server');
    this.initInitialListener();

    return new Promise<void>((res, rej) => {
      this.server.listen(this.port, this.host, callback);
      this.server.once('listening', () => res());
      this.server.once('error', (err) => rej(err));
    });
  }

  async registerCommands() {
    const commands = this.stores.commands
      .map((controller) => {
        const commandBody = controller.register();
        if (!commandBody) return null;
        return commandBody.toJSON();
      })
      .filter((v) => !!v);
    await this.rest.put(Routes.applicationCommands(process.env.APPLICATION_ID!), {
      body: commands,
    });
  }

  private initInitialListener() {
    this.server.on('request', (req, res) => {
      let chunks = Buffer.from([]);

      req.on('data', (chunk) => {
        chunks = Buffer.concat([chunks, chunk]);
      });

      req.on('end', () => {
        /* eslint-disable */
        let data;
        try {
          data = JSON.parse(chunks.toString());
        } catch {
          data = {};
        }
        if (req.url === '/interactions') {
          this.defaultInteractionRoute(req, res, data, chunks);
        } else {
          this.router.lookup(req, res, { data, buffer: chunks });
        }
        /* eslint-enable */
      });
    });
  }

  private defaultInteractionRoute(req: IncomingMessage, res: ServerResponse<IncomingMessage>, data: APIInteraction, buffer: Buffer) {
    res.setHeader('Content-Type', 'application/json');

    const verified = verifyRequest(this.#publicKey, req, buffer);
    if (!verified) return Errors.Unauthorized(res);
    // TODO: break to smaller contexes later? (with `this is ...Context`)
    const ctx = new BaseContext(this.rest, data, this);
    switch (data.type) {
      case InteractionType.Ping:
        return res.writeHead(200).end(JSON.stringify({ type: InteractionResponseType.Pong }));
      case InteractionType.ApplicationCommand:
        req.url = `/commands/${data.data.name}`;
        break;
      case InteractionType.MessageComponent:
        req.url = `/components/${data.data.component_type}/${data.data.custom_id}`;
        break;
      case InteractionType.ApplicationCommandAutocomplete:
        // TODO: add /{focused_option_name}
        req.url = `/autocomplete/${data.data.name}`;
        break;
      case InteractionType.ModalSubmit:
        req.url = `/modals/${data.data.custom_id}`;
        break;
      default:
        return Errors.Unauthorized(res);
    }
    this.router.lookup(req, res, { ctx, buffer });
  }
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
