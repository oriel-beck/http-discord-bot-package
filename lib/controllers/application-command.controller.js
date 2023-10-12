"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationCommandController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const v10_1 = require("discord-api-types/v10");
const base_controller_1 = require("./base.controller");
class ApplicationCommandController extends base_controller_1.BaseController {
    constructor(settings) {
        super();
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: v10_1.ApplicationCommandType.ChatInput
        });
        this.type = settings?.type || v10_1.ApplicationCommandType.ChatInput;
    }
    // eslint-disable-next-line
    handler(context) {
        throw new Error('Method not implemented');
    }
    register() { }
}
exports.ApplicationCommandController = ApplicationCommandController;
//# sourceMappingURL=application-command.controller.js.map