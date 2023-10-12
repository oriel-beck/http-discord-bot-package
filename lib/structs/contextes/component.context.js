"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentContext = void 0;
const base_context_1 = require("@lib/base/base.context");
const functions_1 = require("@lib/contextes/functions");
class ComponentContext extends base_context_1.BaseContext {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "deferWithoutSource", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.deferWithoutSource.bind(this)
        });
        Object.defineProperty(this, "createModal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.createModal.bind(this)
        });
    }
}
exports.ComponentContext = ComponentContext;
//# sourceMappingURL=component.context.js.map