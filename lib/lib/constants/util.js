"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptions = exports.verifyRequest = exports.joinRoute = exports.getRootPath = void 0;
const discord_interactions_1 = require("discord-interactions");
const fs_1 = require("fs");
const path_1 = require("path");
let rootPath = null;
function getRootPath() {
    if (rootPath !== null)
        return rootPath;
    const cwd = process.cwd();
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const file = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(cwd, 'package.json'), 'utf8'));
        if (!file.main)
            throw new Error('Please specify a "main" property in your "package.json" pointing at your main file.');
        rootPath = (0, path_1.dirname)((0, path_1.join)(cwd, file.main));
    }
    catch {
        rootPath = cwd;
    }
    return rootPath; // Return the rootPath directly without converting it to a URL
}
exports.getRootPath = getRootPath;
const joinRoute = (...parts) => parts.join('/');
exports.joinRoute = joinRoute;
function verifyRequest(publicKey, req, buffer) {
    if (req.headers['content-type'] !== 'application/json')
        return false;
    const signature = req.headers['x-signature-ed25519'];
    if (!signature)
        return false;
    const timestamp = req.headers['x-signature-timestamp'];
    if (!timestamp)
        return false;
    const isValidRequest = (0, discord_interactions_1.verifyKey)(buffer, signature, timestamp, publicKey);
    if (!isValidRequest)
        return false;
    return true;
}
exports.verifyRequest = verifyRequest;
function validateOptions(opts) {
    if (opts.botToken && opts.botToken.split('.').length != 3)
        throw new Error(`"${opts.botToken}" is not a valid bot token.`);
    if (opts.defaultRoute && typeof opts.defaultRoute !== 'function')
        throw throwIncorrectConfigError('defaultRoute', 'function', typeof opts.defaultRoute);
    if (opts.djsRestOptions && typeof opts.djsRestOptions !== 'object')
        throw throwIncorrectConfigError('djsRestOptions', 'object', typeof opts.djsRestOptions);
    if (opts.host && typeof opts.host !== 'string')
        throw throwIncorrectConfigError('host', 'string', typeof opts.host);
    if (opts.port && typeof opts.port !== 'number')
        throw throwIncorrectConfigError('port', 'number', typeof opts.port);
    if (opts.publicKey && typeof opts.publicKey !== 'string')
        throw throwIncorrectConfigError('publicKey', 'string', typeof opts.publicKey);
    if (opts.routerOptions && typeof opts.routerOptions !== 'object')
        throw throwIncorrectConfigError('routerOptions', 'object', typeof opts.routerOptions);
    if (opts.loggerOptions && typeof opts.loggerOptions !== 'object')
        throw throwIncorrectConfigError('loggerOptions', 'object', typeof opts.routerOptions);
}
exports.validateOptions = validateOptions;
const throwIncorrectConfigError = (opt, type, got) => new Error(`Expected "${opt}" to be type of "${type}", received "${got}".`);
//# sourceMappingURL=util.js.map