"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalSubmitInteractionController = void 0;
const base_controller_1 = require("../lib/base/base.controller");
class ModalSubmitInteractionController extends base_controller_1.BaseController {
    constructor(settings) {
        super();
        Object.defineProperty(this, "customId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.customId = settings?.customId || this?.customId;
    }
}
exports.ModalSubmitInteractionController = ModalSubmitInteractionController;
//# sourceMappingURL=modal-submit-interaction.controller.js.map