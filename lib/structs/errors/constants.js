"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
exports.Errors = Object.freeze({
    Unauthorized: (res) => res.writeHead(401, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'Unauthorized!', code: 401 })),
});
//# sourceMappingURL=constants.js.map