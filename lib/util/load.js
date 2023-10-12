"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAutocomplete = exports.loadModals = exports.loadComponents = exports.loadCommands = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const util_js_1 = require("./util.js");
const constants_js_1 = require("../structs/errors/constants.js");
async function loadCommands(publicKey, router, path, prefix, store) {
    const canAccess = await (0, promises_1.access)(path)
        .then(() => true)
        .catch(() => false);
    if (!canAccess)
        return;
    for (const dirent of await (0, promises_1.readdir)(path, { withFileTypes: true })) {
        if (dirent.isDirectory()) {
            await loadCommands(publicKey, router, (0, path_1.join)(path, dirent.name), (0, util_js_1.joinRoute)(prefix, dirent.name), store);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const controllerInstance = await getController(`file://${(0, path_1.join)(path, dirent.name)}`);
            const route = genRoute("commands", controllerInstance.type.toString(), dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''));
            store.set(route, controllerInstance);
            loadRoute(publicKey, router, route, controllerInstance);
        }
    }
}
exports.loadCommands = loadCommands;
async function loadComponents(publicKey, router, path, prefix, store) {
    const canAccess = await (0, promises_1.access)(path)
        .then(() => true)
        .catch(() => false);
    if (!canAccess)
        return;
    for (const dirent of await (0, promises_1.readdir)(path, { withFileTypes: true })) {
        if (dirent.isDirectory()) {
            await loadComponents(publicKey, router, (0, path_1.join)(path, dirent.name), (0, util_js_1.joinRoute)(prefix, dirent.name), store);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const controllerInstance = await getController(`file://${(0, path_1.join)(path, dirent.name)}`);
            const split = prefix.split('/');
            split.splice(1, 0, controllerInstance.componentType.toString());
            // TODO: settings.customId should bypass the route generation
            const route = genRoute(split.join('/'), dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''));
            store.set(route, controllerInstance);
            loadRoute(publicKey, router, route, controllerInstance);
        }
    }
}
exports.loadComponents = loadComponents;
async function loadModals(publicKey, router, path, prefix, store) {
    const canAccess = await (0, promises_1.access)(path)
        .then(() => true)
        .catch(() => false);
    if (!canAccess)
        return;
    for (const dirent of await (0, promises_1.readdir)(path, { withFileTypes: true })) {
        if (dirent.isDirectory()) {
            await loadModals(publicKey, router, (0, path_1.join)(path, dirent.name), (0, util_js_1.joinRoute)(prefix, dirent.name), store);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const controllerInstance = await getController(`file://${(0, path_1.join)(path, dirent.name)}`);
            // TODO: settings.customId should bypass the route generation
            const route = genRoute(prefix, dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''));
            store.set(route, controllerInstance);
            loadRoute(publicKey, router, route, controllerInstance);
        }
    }
}
exports.loadModals = loadModals;
async function loadAutocomplete(publicKey, router, path, prefix, store) {
    const canAccess = await (0, promises_1.access)(path)
        .then(() => true)
        .catch(() => false);
    if (!canAccess)
        return;
    for (const dirent of await (0, promises_1.readdir)(path, { withFileTypes: true })) {
        if (dirent.isDirectory()) {
            await loadAutocomplete(publicKey, router, (0, path_1.join)(path, dirent.name), (0, util_js_1.joinRoute)(prefix, dirent.name), store);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const controllerInstance = await getController(`file://${(0, path_1.join)(path, dirent.name)}`);
            const route = genRoute(prefix, dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''), controllerInstance.option);
            store.set(route, controllerInstance);
            loadRoute(publicKey, router, route, controllerInstance);
        }
    }
}
exports.loadAutocomplete = loadAutocomplete;
function loadRoute(publicKey, router, route, controller) {
    router.post(route, function (req, res, params) {
        const verified = (0, util_js_1.verifyRequest)(publicKey, req, this.buffer);
        if (!verified)
            return constants_js_1.Errors.Unauthorized(res);
        this.ctx.params = params || {};
        controller.handler(this.ctx);
    });
}
async function getController(path) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return new (await import(path)).default();
}
function genRoute(...parts) {
    let route = (0, util_js_1.joinRoute)(...parts);
    route = route[route.length - 1] === '/' ? route.substring(0, route.length - 1) : route;
    return `/${route.replace(/\[([^)]+)\]/g, ':$1')}`;
}
//# sourceMappingURL=load.js.map