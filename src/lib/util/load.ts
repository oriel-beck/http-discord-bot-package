import type findMyWay from 'find-my-way';
import {
  type APIInteraction,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  APIChatInputApplicationCommandInteractionData,
} from 'discord-api-types/v10';
import type {
  AnyController,
  ApplicationCommandController,
  AutocompleteInteractionController,
  ComponentInteractionController,
  ModalSubmitInteractionController,
} from '@src/controllers';
import type { BaseContext } from '@lib/base/base.context';
import { access, readdir } from 'fs/promises';
import { join } from 'path';
import { Errors } from '@lib/errors/constants';
import SuperMap from '@thunder04/supermap';
import { joinRoute, verifyRequest } from './util';
import { ApplicationCommandContext } from '@src/index';

export async function loadCommands(
  publicKey: string,
  router: findMyWay.Instance<findMyWay.HTTPVersion.V1>,
  path: string,
  prefix: string,
  store: SuperMap<string, ApplicationCommandController>,
) {
  const canAccess = await canAccessPath(path);
  if (!canAccess) return;
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      await loadCommands(publicKey, router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<ApplicationCommandController>(`file://${join(path, dirent.name)}`);
      const commandData = controllerInstance.register();
      if (!commandData) continue;
      const route = genRoute('commands', commandData.toJSON().type?.toString() || '1', dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''));
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
  const canAccess = await canAccessPath(path);
  if (!canAccess) return;
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      await loadComponents(publicKey, router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<ComponentInteractionController>(`file://${join(path, dirent.name)}`);
      const split = prefix.split('/');
      split.splice(1, 0, controllerInstance.componentType.toString());
      const route = controllerInstance.customId || genRoute(split.join('/'), dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''));
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
  const canAccess = await canAccessPath(path);
  if (!canAccess) return;
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      await loadModals(publicKey, router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<ModalSubmitInteractionController>(`file://${join(path, dirent.name)}`);
      const route = controllerInstance.customId || genRoute(prefix, dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''));
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
  const canAccess = await canAccessPath(path);
  if (!canAccess) return;
  for (const dirent of await readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      await loadAutocomplete(publicKey, router, join(path, dirent.name), joinRoute(prefix, dirent.name), store);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const controllerInstance = await getController<AutocompleteInteractionController>(`file://${join(path, dirent.name)}`);
      const route = genRoute(
        prefix,
        controllerInstance.commandName || dirent.name === 'index.js' ? '' : dirent.name.replace('.js', ''),
        controllerInstance.option,
      );
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

    // A lot of TS wizardry
    if (this.ctx instanceof ApplicationCommandContext && (this.ctx as ApplicationCommandContext).data.data.type === ApplicationCommandType.ChatInput) {
      const subcommand = (this.ctx.data as APIChatInputApplicationCommandInteractionData).options?.find(
        (option) => option.type === ApplicationCommandOptionType.Subcommand,
      );
      if (subcommand) {
        const applicationCommandController = controller as ApplicationCommandController;
        const subcommandFunction = applicationCommandController[
          applicationCommandController.subcommands[subcommand.name] as keyof ApplicationCommandController
        ] as (ctx: ApplicationCommandContext) => unknown;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return subcommandFunction(this.ctx);
      }
    }
    controller.handler(this.ctx as never);
  });
}

async function getController<T>(path: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return new (await import(path)).default() as T;
}

function genRoute(...parts: string[]) {
  let route = joinRoute(...parts);
  route = route[route.length - 1] === '/' ? route.substring(0, route.length - 1) : route;
  return `/${route.replace(/\[([^/]+)]/g, ':$1')}`;
}

const canAccessPath = (path: string) =>
  access(path)
    .then(() => true)
    .catch(() => false);
