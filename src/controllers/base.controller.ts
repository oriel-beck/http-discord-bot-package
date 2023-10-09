import type { IncomingMessage, ServerResponse } from 'http';

export abstract class BaseController {
  abstract handler(req: IncomingMessage, res: ServerResponse<IncomingMessage>, params: Record<string, string | undefined>, data: unknown): unknown;
}
