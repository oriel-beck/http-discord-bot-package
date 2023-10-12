"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteInteractionController = void 0;
const base_controller_1 = require("./base.controller");
class AutocompleteInteractionController extends base_controller_1.BaseController {
    constructor(settings) {
        super();
        Object.defineProperty(this, "option", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "commandName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.option = settings?.option || this?.option;
        this.commandName = settings?.commandName || this?.commandName;
    }
    handler(context) {
        throw new Error('Method not implemented');
    }
}
exports.AutocompleteInteractionController = AutocompleteInteractionController;
//# sourceMappingURL=autocomplete-interaction.controller.js.map