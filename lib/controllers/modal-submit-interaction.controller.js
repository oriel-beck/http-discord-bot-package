"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalSubmitInteractionController = void 0;
const base_controller_1 = require("./base.controller");
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
    handler(context) {
        throw new Error('Method not implemented');
    }
}
exports.ModalSubmitInteractionController = ModalSubmitInteractionController;
//# sourceMappingURL=modal-submit-interaction.controller.js.map