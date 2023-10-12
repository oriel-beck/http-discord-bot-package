"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContext = void 0;
const functions_1 = require("../contextes/functions");
class BaseContext {
    constructor(data, client) {
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: data
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: client
        });
        Object.defineProperty(this, "params", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "reply", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.reply.bind(this)
        });
        Object.defineProperty(this, "deferWithSource", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.deferWithSource.bind(this)
        });
        Object.defineProperty(this, "getMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.getMessage.bind(this)
        });
        Object.defineProperty(this, "updateMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.updateMessage.bind(this)
        });
        Object.defineProperty(this, "deleteMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.deleteMessage.bind(this)
        });
        Object.defineProperty(this, "followUp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.followUp.bind(this)
        });
    }
}
exports.BaseContext = BaseContext;
//# sourceMappingURL=base.context.js.map