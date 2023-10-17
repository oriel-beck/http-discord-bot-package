import { join } from 'path';
import http, { type IncomingMessage, type ServerResponse } from 'http';
import pino, { type Logger, type LoggerOptions } from 'pino';
import findMyWay from 'find-my-way';
import { type APIApplicationCommandInteractionDataOption, type APIInteraction, InteractionResponseType, InteractionType } from 'discord-api-types/v10';
import SuperMap from '@thunder04/supermap';

import type {
  ApplicationCommandController,
  AutocompleteInteractionController,
  ComponentInteractionController,
  ModalSubmitInteractionController,
} from '../../controllers';
import { ApplicationCommandContext, AutocompleteContext, ComponentContext, ModalSubmitContext } from '../contextes';
import { getRootPath, validateOptions, verifyRequest } from '@lib/util/util';
import { loadAutocomplete, loadCommands, loadComponents, loadModals } from '@lib/util/load';
import { Errors } from '@lib/errors/constants';
import { SnowTransfer } from 'snowtransfer';

export class Client {
  #publicKey: string;
  rest!: SnowTransfer;
  stores = {
    commands: new SuperMap<string, ApplicationCommandController>(),
    components: new SuperMap<string, ComponentInteractionController>(),
    modals: new SuperMap<string, ModalSubmitInteractionController>(),
    autocomplete: new SuperMap<string, AutocompleteInteractionController>(),
  };
  server = http.createServer();
  logger: Logger;
  router: findMyWay.Instance<findMyWay.HTTPVersion.V1>;
  port: number;
  host: string | undefined;
  applicationId?: string;

  constructor(opts: ClientOptions) {
    validateOptions(opts);

    this.logger = pino({
      level: 'debug',
      name: 'discord-http-bot',
      ...opts?.loggerOptions,
    });
    this.router = findMyWay({
      defaultRoute: (req, res) => (opts?.defaultRoute ? opts.defaultRoute(req, res) : {}),
      ...opts?.routerOptions,
    });
    this.port = opts?.port || 5000;
    this.host = opts?.host;
    this.#publicKey = opts.publicKey;
  }

  async login(token: string) {
    if (!token || typeof token !== 'string') throw new Error('Please provide a valid bot token');
    this.applicationId = Buffer.from(token.split('.').at(0)!, 'base64').toString('ascii');
    this.rest = new SnowTransfer(token);

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

    return new Promise<string>((res, rej) => {
      this.server.listen(this.port, this.host);
      this.server.once('listening', () => res(this.applicationId!));
      this.server.once('error', (err) => rej(err));
    });
  }

  async registerCommands() {
    const commands = this.stores.commands
      .map((controller) => {
        const commandBody = controller.register();
        return commandBody.toJSON();
      })
      .filter((v) => !!v);

    await this.rest.interaction.bulkOverwriteApplicationCommands(this.applicationId!, commands);
  }

  private initInitialListener() {
    this.server.on('request', (req, res) => {
      const originalUrl = req.url;
      this.logger.debug(`Incoming request ${originalUrl}`);
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

      req.on('close', () => {
        this.logger.debug(`Finished handling request ${originalUrl}${originalUrl === req.url ? '' : ` (${req.url})`}`);
      });
    });
  }

  private defaultInteractionRoute(req: IncomingMessage, res: ServerResponse<IncomingMessage>, data: APIInteraction, buffer: Buffer) {
    res.setHeader('Content-Type', 'application/json');

    const verified = verifyRequest(this.#publicKey, req, buffer);
    if (!verified) {
      return Errors.Unauthorized(res);
    }
    let ctx;
    switch (data.type) {
      case InteractionType.Ping:
        return res.writeHead(200).end(JSON.stringify({ type: InteractionResponseType.Pong }));
      case InteractionType.ApplicationCommand:
        req.url = `/commands/${data.data.type}/${data.data.name}`;
        ctx = new ApplicationCommandContext(data, this);
        break;
      case InteractionType.MessageComponent:
        req.url = `/components/${data.data.component_type}/${data.data.custom_id}`;
        ctx = new ComponentContext(data, this);
        break;
      case InteractionType.ApplicationCommandAutocomplete:
        // TODO: add /{focused_option_name}
        req.url = `/autocomplete/${data.data.name}/${data.data.options.find(
          (opt: APIApplicationCommandInteractionDataOption & { focused?: boolean }) => opt?.focused === true,
        )?.name}`;
        ctx = new AutocompleteContext(data, this);
        break;
      case InteractionType.ModalSubmit:
        req.url = `/modals/${data.data.custom_id}`;
        ctx = new ModalSubmitContext(data, this);
        break;
      default:
        return Errors.Unauthorized(res);
    }
    this.router.lookup(req, res, { ctx, buffer });
  }
}

export interface ClientOptions {
  port?: number;
  host?: string;
  publicKey: string;
  loggerOptions?: LoggerOptions;
  routerOptions?: findMyWay.Config<findMyWay.HTTPVersion.V1>;
  defaultRoute?(req: IncomingMessage, res: ServerResponse<IncomingMessage>): unknown;
}
