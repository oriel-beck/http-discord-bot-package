import { IncomingMessage, ServerResponse } from 'http';

export const Errors = Object.freeze({
  Unauthorized: (res: ServerResponse<IncomingMessage>) =>
    res.writeHead(401, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'Unauthorized!', code: 401 })),
});
