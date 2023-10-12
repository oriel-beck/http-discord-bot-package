"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationCommandContext = void 0;
const base_context_1 = require("@lib/base/base.context");
const functions_1 = require("@lib/contextes/functions");
class ApplicationCommandContext extends base_context_1.BaseContext {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "createModal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.createModal.bind(this)
        });
    }
}
exports.ApplicationCommandContext = ApplicationCommandContext;
//# sourceMappingURL=application-command.context.js.map