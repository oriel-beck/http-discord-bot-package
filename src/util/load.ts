import type findMyWay from 'find-my-way';
import type { AnyController } from '../controllers/types.js';

import { access, readdir } from 'fs/promises';
import { join } from 'path';
import SuperMap from '@thunder04/supermap';
import { ComponentInteractionController } from '../controllers/component-interaction.controller.js';
import { AutocompleteInteractionController } from '../controllers/autocomplete-interaction.controller.js';
import { joinRoute, verifyRequest } from './util.js';
import { ApplicationCommandController } from '../controllers/application-command.controller.js';
import { Errors } from '../structs/errors/constants.js';
import { ModalSubmitInteractionController } from '../controllers/modal-submit-interaction.controller.js';
import { BaseContext } from '../structs/contextes/base.context.js';
import { APIInteraction } from 'discord-api-types/v10';

export async function loadCommands(
  publicKey: string,
  router: findMyWay.Instance<findMyWay.HTTPVersion.V1>,
  path: string,
  prefix: string,
  store: SuperMap<string, ApplicationCommandController>,
) {
  const canAccess = await access(path)
    .then(() => true)
    .catch(() => false);
  if (!canAccess) return;
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      await loadCommands(publicKey, router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<ApplicationCommandController>(`file://${join(path, dirent.name)}`);
      const route = genRoute(prefix, dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''));
      store.set(route, controllerInstance);
      loadRoute(publicKey, router, route, controllerInstance);
    }
  }
}

export async function loadComponents(
  publicKey: string,
  router: findMyWay.Instance<findMyWay.HTTPVersion.V1>,
  path: string,
  prefix: string,
  store: SuperMap<string, ComponentInteractionController>,
) {
  const canAccess = await access(path)
    .then(() => true)
    .catch(() => false);
  if (!canAccess) return;
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      await loadComponents(publicKey, router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<ComponentInteractionController>(`file://${join(path, dirent.name)}`);
      const split = prefix.split('/');
      split.splice(1, 0, controllerInstance.componentType.toString());
      // TODO: settings.customId should bypass the route generation
      const route = genRoute(split.join('/'), dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''));
      store.set(route, controllerInstance);
      loadRoute(publicKey, router, route, controllerInstance);
    }
  }
}

export async function loadModals(
  publicKey: string,
  router: findMyWay.Instance<findMyWay.HTTPVersion.V1>,
  path: string,
  prefix: string,
  store: SuperMap<string, ModalSubmitInteractionController>,
) {
  const canAccess = await access(path)
    .then(() => true)
    .catch(() => false);
  if (!canAccess) return;
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      await loadModals(publicKey, router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<ModalSubmitInteractionController>(`file://${join(path, dirent.name)}`);
      // TODO: settings.customId should bypass the route generation
      const route = genRoute(prefix, dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''));
      store.set(route, controllerInstance);
      loadRoute(publicKey, router, route, controllerInstance);
    }
  }
}

export async function loadAutocomplete(
  publicKey: string,
  router: findMyWay.Instance<findMyWay.HTTPVersion.V1>,
  path: string,
  prefix: string,
  store: SuperMap<string, AutocompleteInteractionController>,
) {
  const canAccess = await access(path)
    .then(() => true)
    .catch(() => false);
  if (!canAccess) return;
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      await loadAutocomplete(publicKey, router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<AutocompleteInteractionController>(`file://${join(path, dirent.name)}`);
      const route = genRoute(prefix, dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''), controllerInstance.option);
      store.set(route, controllerInstance);
      loadRoute(publicKey, router, route, controllerInstance);
    }
  }
}

function loadRoute(publicKey: string, router: findMyWay.Instance<findMyWay.HTTPVersion.V1>, route: string, controller: AnyController) {
  router.post(route, function (this: { ctx: BaseContext<APIInteraction>; buffer: Buffer }, req, res, params) {
    const verified = verifyRequest(publicKey, req, this.buffer);
    if (!verified) return Errors.Unauthorized(res);
    this.ctx.params = params || {};
    controller.handler(this.ctx as never);
  });
}

async function getController<T>(path: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return new (await import(path)).default() as T;
}

function genRoute(...parts: string[]) {
  let route = joinRoute(...parts)
  route = route[route.length - 1] === '/' ? route.substring(0, route.length - 1) : route;
  return `/${route.replace(/\[([^)]+)\]/g, ':$1')}`;
}
