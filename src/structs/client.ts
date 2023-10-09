import { join } from 'path';
import http, { type IncomingMessage, type ServerResponse } from 'http';
import pino, { type Logger, type LoggerOptions } from 'pino';
import findMyWay from 'find-my-way';
import { InteractionType, Routes } from 'discord-api-types/v10';
import { REST, type RESTOptions } from '@discordjs/rest';
import SuperMap from '@thunder04/supermap';

import { loadAutocomplete, loadCommands, loadComponents, loadModals } from '../util/load';
import { ApplicationCommandController } from '../controllers/application-command.controller';
import { ComponentInteractionController } from '../controllers/component-interaction.controller';
import { ModalSubmitInteractionController } from '../controllers/modal-submit-interaction.controller';
import { AutocompleteInteractionController } from '../controllers/autocomplete-interaction.controller';
import { ValidationError } from './errors/validation.error';
import { IncorrectTypeError } from './errors/incorrect-type.error';
import { Errors } from './errors/constants';
import { getRootPath, verifyRequest } from '../util/util';

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

  constructor(opts?: HttpBotClientOptions) {
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
  }

  async login(token: string, callback?: () => unknown) {
    if (!token) throw new ValidationError('Missing argument "token"');
    if (typeof token !== 'string') throw new IncorrectTypeError('token', 'string', typeof token);
    const applicationId = Buffer.from(token.split('.').at(0)!, 'base64').toString('ascii');
    this.logger.debug(`Logging in as ${applicationId}`);
    this.rest.setToken(token);
    const maindir = getRootPath();

    this.logger.info('Initiating commands');
    let ts = Date.now();
    await loadCommands(this.router, join(maindir, 'commands'), 'commands', this.stores.commands);
    this.logger.info(`Initiated commands in ${Date.now() - ts}ms`);

    this.logger.info('Initiating componenets');
    ts = Date.now();
    await loadComponents(this.router, join(maindir, 'components'), 'components', this.stores.components);
    this.logger.info(`Initiated components in ${Date.now() - ts}ms`);

    this.logger.info('Initiating modals');
    ts = Date.now();
    await loadModals(this.router, join(maindir, 'modals'), 'modals', this.stores.modals);
    this.logger.info(`Initiated modals in ${Date.now() - ts}ms`);

    this.logger.info('Initiating autocomplete');
    ts = Date.now();
    await loadAutocomplete(this.router, join(maindir, 'autocomplete'), 'autocomplete', this.stores.autocomplete);
    this.logger.info(`Initiated autocomplete in ${Date.now() - ts}ms`);

    this.logger.info('Initiating server');
    this.initInitialListener();

    return new Promise<void>((res, rej) => {
      this.server.listen(5000, '0.0.0.0', callback);
      this.server.once('listening', () => res());
      this.server.once('error', (err) => rej(err));
    });
  }

  async registerCommands() {
    const commands = this.stores.commands.map((controller) => {
      const commandBody = controller.register();
      if (!commandBody) return null;
      return commandBody.toJSON();
    }).filter((v) => !!v);
    await this.rest.put(Routes.applicationCommands(process.env.APPLICATION_ID!), {
      body: commands
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
        }
        this.router.lookup(req, res, { data, buffer: chunks });
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

    const verified = verifyRequest(req, buffer);
    if (verified) return Errors.Unauthorized(res);
    switch (data.type) {
      case InteractionType.Ping:
        return res.end(JSON.stringify({ type: InteractionType.Ping }));
      case InteractionType.ApplicationCommand:
        req.url = `/commands/${data.data.name}`;
        this.router.lookup(req, res, { data, buffer });
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
  loggerOptions?: LoggerOptions;
  routerOptions?: findMyWay.Config<findMyWay.HTTPVersion.V1>;
  djsRestOptions?: Partial<RESTOptions>;
  defaultRoute?(req: IncomingMessage, res: ServerResponse<IncomingMessage>): unknown;
}
