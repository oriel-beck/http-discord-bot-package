import type http from 'http';

export const Errors = Object.freeze({
  Unauthorized: (res: http.ServerResponse<http.IncomingMessage>) => res.writeHead(401).end(JSON.stringify({ message: 'Unauthorized!', code: 401 })),
});

export const RouteSettingsMode = Object.freeze({
  Append: 'append',
  Replace: 'replace',
});
