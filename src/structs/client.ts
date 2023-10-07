import { join } from 'path';
import http, { type IncomingMessage, type ServerResponse } from 'http';
import pino, { type Logger, type LoggerOptions } from 'pino';
import findMyWay from 'find-my-way';
import { InteractionType } from 'discord-api-types/v10';
import { Errors } from '../util/constants';
import { verifyKey } from 'discord-interactions';
import { REST, type RESTOptions } from '@discordjs/rest';
import { SuperMap } from '@thunder04/supermap';

import { walkRoutes } from '../util/load';
import { getRootPath } from '../util/util';
import {
  ApplicationCommandController,
  AutocompleteInteractionController,
  ComponentInteractionController,
  ModalSubmitInteractionController,
} from '../controllers';
import { IncorrectTypeError, ValidationError } from './errors';

export class HttpOnlyBot {
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

  constructor(opts: HttpBotClientOptions) {
    this.logger = pino({
      level: 'debug',
      name: 'http-only-bot',
      ...opts.logger,
    });
    this.router = findMyWay(opts.router);
    this.rest = new REST(opts.djsRest);
  }

  async login(token: string) {
    if (!token) throw new ValidationError('Missing argument "token"');
    if (typeof token !== 'string') throw new IncorrectTypeError('token', 'string', typeof token);
    const applicationId = Buffer.from(token.split('.').at(0)!, 'base64').toString('ascii');
    this.logger.debug(`Logging in as ${applicationId}`);
    this.rest.setToken(token);
    const maindir = getRootPath();

    this.logger.info('Initiating commands');
    let ts = Date.now();
    await walkRoutes(this.router, join(maindir, 'commands'), this.logger, this.stores.commands, 'commands');
    this.logger.info(`Initiated commands in ${Date.now() - ts}ms`);

    this.logger.info('Initiating componenets');
    ts = Date.now();
    await walkRoutes(this.router, join(maindir, 'components'), this.logger, this.stores.components, 'components');
    this.logger.info(`Initiated components in ${Date.now() - ts}ms`);

    this.logger.info('Initiating modals');
    ts = Date.now();
    await walkRoutes(this.router, join(maindir, 'modals'), this.logger, this.stores.modals, 'modals');
    this.logger.info(`Initiated modals in ${Date.now() - ts}ms`);

    this.logger.info('Initiating autocomplete');
    ts = Date.now();
    await walkRoutes(this.router, join(maindir, 'autocomplete'), this.logger, this.stores.autocomplete, 'autocomplete');
    this.logger.info(`Initiated autocomplete in ${Date.now() - ts}ms`);

    this.logger.info('Initiating server');
    this.server.on('listening', () => this.logger.info('Server is listening'));
    this.server.listen(5000, '0.0.0.0');

    this.initInitialListener();
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
        }
        this.router.lookup(req, res, { data, buf: chunks });
        /* eslint-enable */
      });
    });
  }

  private defaultInteractionRoute(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    data: { type: InteractionType; data: { name?: string; custom_id?: string } },
    buffer: Buffer,
  ) {
    res.setHeader('Content-Type', 'application/json');
    if (req.headers['content-type'] !== 'application/json') return Errors.Unauthorized(res);

    const signature = req.headers['x-signature-ed25519'] as string | undefined;
    if (!signature) return Errors.Unauthorized(res);

    const timestamp = req.headers['x-signature-timestamp'] as string | undefined;
    if (!timestamp) return Errors.Unauthorized(res);

    const isValidRequest = verifyKey(buffer, signature, timestamp, process.env.APPLICATION_PUBLIC_KEY!);
    if (!isValidRequest) return Errors.Unauthorized(res);
    switch (data.type) {
      case InteractionType.Ping:
        return res.end(JSON.stringify({ type: InteractionType.Ping }));
      case InteractionType.ApplicationCommand:
        req.url = `/commands/${data.data.name}`;
        this.router.lookup(req, res, { data });
        break;
      case InteractionType.MessageComponent:
        break;
      case InteractionType.ApplicationCommandAutocomplete:
        break;
      case InteractionType.ModalSubmit:
        break;
      default:
        Errors.Unauthorized(res);
    }
    return;
  }
}

export interface HttpBotClientOptions {
  logger: LoggerOptions;
  router: findMyWay.Config<findMyWay.HTTPVersion.V1>;
  djsRest: Partial<RESTOptions>;
  defaultRoute(req: IncomingMessage, res: ServerResponse<IncomingMessage>): unknown;
}
