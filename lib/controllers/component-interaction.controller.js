"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentInteractionController = void 0;
const base_controller_1 = require("../lib/base/base.controller");
class ComponentInteractionController extends base_controller_1.BaseController {
    constructor(settings) {
        super();
        Object.defineProperty(this, "componentType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.componentType = settings?.componentType || this?.componentType;
    }
}
exports.ComponentInteractionController = ComponentInteractionController;
//# sourceMappingURL=component-interaction.controller.js.map