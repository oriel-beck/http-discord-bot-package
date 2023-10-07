import type { IncomingMessage, ServerResponse } from 'http';
import type { BaseControllerSettings, RouteSettings } from './types';

export abstract class BaseController {
  name?: string;
  routeSettings?: RouteSettings;
  constructor(settings: BaseControllerSettings) {
    this.name = settings?.name;
    this.routeSettings = settings?.routeSettings;
  }

  abstract handler(req: IncomingMessage, res: ServerResponse<IncomingMessage>, params: Record<string, string | undefined>, data: unknown): unknown;
}
