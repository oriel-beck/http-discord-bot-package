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

export async function loadCommands(
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
      await loadCommands(router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<ApplicationCommandController>(`file://${join(path, dirent.name)}`)
      const route = buildRoute(joinRoute(prefix, dirent.name === 'index.js' ? '' : dirent.name));
      loadRoute(router, route, controllerInstance);
    }
  }
}

export async function loadComponents(
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
      await loadComponents(router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<ComponentInteractionController>(`file://${join(path, dirent.name)}`)
      const route = buildRoute(joinRoute(prefix, controllerInstance.componentType.toString(), dirent.name === 'index.js' ? '' : dirent.name));
      loadRoute(router, route, controllerInstance);
    }
  }
}

export async function loadModals(
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
      await loadModals(router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<ModalSubmitInteractionController>(`file://${join(path, dirent.name)}`)
      const route = buildRoute(joinRoute(prefix, dirent.name === 'index.js' ? '' : dirent.name));
      loadRoute(router, route, controllerInstance);
    }
  }
}

export async function loadAutocomplete(
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
      await loadAutocomplete(router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<AutocompleteInteractionController>(`file://${join(path, dirent.name)}`)
      const route = buildRoute(joinRoute(prefix, dirent.name === 'index.js' ? '' : dirent.name, controllerInstance.option));
      loadRoute(router, route, controllerInstance);
    }
  }
}

function loadRoute<T extends never>(router: findMyWay.Instance<findMyWay.HTTPVersion.V1>, route: string, controller: AnyController) {
  router.post(route, function (this: { data: unknown; buffer: Buffer }, req, res, params) {
    const verified = verifyRequest(req, this.buffer);
    if (!verified) return Errors.Unauthorized(res);
    controller.handler(req, res, params, this.data as T);
  });
}

const buildRoute = (route: string) => `/${route.replace(/\[([^)]+)\]/g, ':$1')}`
async function getController<T>(path: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return new (await import(path)).default() as T;
}

/*
Plan for commands:
/commands
  /applications (group)
    /deny.ts (subcommand)
  /applications (group)
    /deny (name for subcommand)
      /index.ts (subcommand)
  /applications (group)
    /deny (subcommand)
      /deny.ts (error)
  /ping.ts (command)
  /help
    /index.ts (command)
*/
