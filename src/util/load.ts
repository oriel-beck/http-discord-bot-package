import type findMyWay from 'find-my-way';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import type { AnyController } from '../controllers/types.js';
import type { Logger } from 'pino';
import SuperMap from '@thunder04/supermap';
import { ComponentInteractionController } from '../controllers/component-interaction.controller.js';
import { AutocompleteInteractionController } from '../controllers/autocomplete-interaction.controller.js';

export async function walkRoutes<T extends AnyController>(
  router: findMyWay.Instance<findMyWay.HTTPVersion.V1>,
  folder: string,
  logger: Logger,
  store: SuperMap<string, T>,
  prefix = '',
) {
  const files = await readdir(folder, { withFileTypes: true });
  for (const dirent of files) {
    const filePath = join(folder, dirent.name);
    const direntStat = await stat(filePath);
    if (direntStat.isDirectory()) {
      await walkRoutes(router, filePath, logger, store, join(prefix, dirent?.name));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const ControllerClass: new () => AnyController = (await import(filePath)).default;
      const controllerInstance = new ControllerClass();
      if (controllerInstance instanceof ComponentInteractionController) {
        // make the route into `components/type/{name}/{prefix}`
        prefix = join('components', controllerInstance.componentType.toString(), prefix);
      }

      const { name, routeSettings } = controllerInstance;

      let route = join(prefix, name || dirent?.name === 'index.js' ? '' : dirent?.name.replace('.js', ''));
      if (routeSettings && routeSettings.route) {
        if (routeSettings.mode === 'append') {
          route = join(route, routeSettings.route);
        } else {
          route = routeSettings.route;
        }
      }

      if (controllerInstance instanceof AutocompleteInteractionController) {
        route += controllerInstance.option;
      }

      route = `/${route.replace(/\[([^)]+)\]/g, ':$1')}`;
      logger.debug(`Loading route ${route}, filePath: ${filePath}`);
      store.set(route, controllerInstance as T);
      router.post(route, function (this: { data: unknown }, req, res, params) {
        controllerInstance.handler(req, res, params, this.data as never);
      });
    }
  }
}
