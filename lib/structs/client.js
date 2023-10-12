"use strict";
var _HttpOnlyBot_publicKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpOnlyBot = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const http_1 = tslib_1.__importDefault(require("http"));
const pino_1 = tslib_1.__importDefault(require("pino"));
const find_my_way_1 = tslib_1.__importDefault(require("find-my-way"));
const v10_1 = require("discord-api-types/v10");
const rest_1 = require("@discordjs/rest");
const supermap_1 = tslib_1.__importDefault(require("@thunder04/supermap"));
const contextes_1 = require("../structs/contextes");
const util_1 = require("@lib/util/util");
const load_1 = require("@lib/util/load");
const constants_1 = require("@lib/errors/constants");
class HttpOnlyBot {
    constructor(opts) {
        _HttpOnlyBot_publicKey.set(this, void 0);
        Object.defineProperty(this, "stores", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                commands: new supermap_1.default(),
                components: new supermap_1.default(),
                modals: new supermap_1.default(),
                autocomplete: new supermap_1.default(),
            }
        });
        Object.defineProperty(this, "rest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "server", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: http_1.default.createServer()
        });
        Object.defineProperty(this, "logger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "router", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "port", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "host", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "applicationId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        (0, util_1.validateOptions)(opts);
        this.logger = (0, pino_1.default)({
            level: 'debug',
            name: 'http-only-bot',
            ...opts?.loggerOptions,
        });
        this.router = (0, find_my_way_1.default)({
            defaultRoute: (req, res) => (opts?.defaultRoute ? opts.defaultRoute(req, res) : {}),
            ...opts?.routerOptions,
        });
        this.rest = new rest_1.REST(opts?.djsRestOptions);
        this.port = opts?.port || 5000;
        this.host = opts?.host;
        this.applicationId = Buffer.from(opts.botToken.split('.').at(0), 'base64').toString('ascii');
        tslib_1.__classPrivateFieldSet(this, _HttpOnlyBot_publicKey, opts.publicKey, "f");
        this.rest.setToken(opts.botToken);
    }
    async login(callback) {
        this.logger.debug(`Logging in as ${this.applicationId}`);
        const maindir = (0, util_1.getRootPath)();
        this.logger.info('Initiating commands');
        let ts = Date.now();
        await (0, load_1.loadCommands)(tslib_1.__classPrivateFieldGet(this, _HttpOnlyBot_publicKey, "f"), this.router, (0, path_1.join)(maindir, 'commands'), 'commands', this.stores.commands);
        this.logger.info(`Initiated commands in ${Date.now() - ts}ms`);
        this.logger.info('Initiating componenets');
        ts = Date.now();
        await (0, load_1.loadComponents)(tslib_1.__classPrivateFieldGet(this, _HttpOnlyBot_publicKey, "f"), this.router, (0, path_1.join)(maindir, 'components'), 'components', this.stores.components);
        this.logger.info(`Initiated components in ${Date.now() - ts}ms`);
        this.logger.info('Initiating modals');
        ts = Date.now();
        await (0, load_1.loadModals)(tslib_1.__classPrivateFieldGet(this, _HttpOnlyBot_publicKey, "f"), this.router, (0, path_1.join)(maindir, 'modals'), 'modals', this.stores.modals);
        this.logger.info(`Initiated modals in ${Date.now() - ts}ms`);
        this.logger.info('Initiating autocomplete');
        ts = Date.now();
        await (0, load_1.loadAutocomplete)(tslib_1.__classPrivateFieldGet(this, _HttpOnlyBot_publicKey, "f"), this.router, (0, path_1.join)(maindir, 'autocomplete'), 'autocomplete', this.stores.autocomplete);
        this.logger.info(`Initiated autocomplete in ${Date.now() - ts}ms`);
        this.logger.info('Initiating server');
        this.initInitialListener();
        return new Promise((res, rej) => {
            this.server.listen(this.port, this.host, callback);
            this.server.once('listening', () => res());
            this.server.once('error', (err) => rej(err));
        });
    }
    async registerCommands() {
        const commands = this.stores.commands
            .map((controller) => {
            const commandBody = controller.register();
            if (!commandBody)
                return null;
            return commandBody.toJSON();
        })
            .filter((v) => !!v);
        await this.rest.put(v10_1.Routes.applicationCommands(process.env.APPLICATION_ID), {
            body: commands,
        });
    }
    initInitialListener() {
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
                }
                catch {
                    data = {};
                }
                if (req.url === '/interactions') {
                    this.defaultInteractionRoute(req, res, data, chunks);
                }
                else {
                    this.router.lookup(req, res, { data, buffer: chunks });
                }
                /* eslint-enable */
            });
            req.on('close', () => {
                this.logger.debug(`Finished handling request ${originalUrl}${originalUrl === req.url ? '' : ` (${req.url})`}`);
            });
        });
    }
    defaultInteractionRoute(req, res, data, buffer) {
        res.setHeader('Content-Type', 'application/json');
        const verified = (0, util_1.verifyRequest)(tslib_1.__classPrivateFieldGet(this, _HttpOnlyBot_publicKey, "f"), req, buffer);
        if (!verified) {
            return constants_1.Errors.Unauthorized(res);
        }
        // TODO: break to smaller contexes later? (with `this is ...Context`)
        let ctx;
        switch (data.type) {
            case v10_1.InteractionType.Ping:
                return res.writeHead(200).end(JSON.stringify({ type: v10_1.InteractionResponseType.Pong }));
            case v10_1.InteractionType.ApplicationCommand:
                req.url = `/commands/${data.data.type}/${data.data.name}`;
                ctx = new contextes_1.ApplicationCommandContext(data, this);
                break;
            case v10_1.InteractionType.MessageComponent:
                req.url = `/components/${data.data.component_type}/${data.data.custom_id}`;
                ctx = new contextes_1.ComponentContext(data, this);
                break;
            case v10_1.InteractionType.ApplicationCommandAutocomplete:
                // TODO: add /{focused_option_name}
                req.url = `/autocomplete/${data.data.name}/${data.data.options.find((opt) => opt?.focused === true)?.name}`;
                ctx = new contextes_1.AutocompleteContext(data, this);
                break;
            case v10_1.InteractionType.ModalSubmit:
                req.url = `/modals/${data.data.custom_id}`;
                ctx = new contextes_1.ModalSubmitContext(data, this);
                break;
            default:
                return constants_1.Errors.Unauthorized(res);
        }
        this.router.lookup(req, res, { ctx, buffer });
    }
}
exports.HttpOnlyBot = HttpOnlyBot;
_HttpOnlyBot_publicKey = new WeakMap();
//# sourceMappingURL=client.js.map