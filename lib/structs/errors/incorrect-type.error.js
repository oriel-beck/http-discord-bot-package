"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncorrectTypeError = void 0;
class IncorrectTypeError extends TypeError {
    constructor(arg, type, received) {
        super(`Expected "${arg}" to be type of "${type}", received type of "${received}"`);
    }
}
exports.IncorrectTypeError = IncorrectTypeError;
//# sourceMappingURL=incorrect-type.error.js.map