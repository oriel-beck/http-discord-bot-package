"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteContext = void 0;
const base_context_1 = require("@lib/base/base.context");
const functions_1 = require("@lib/contextes/functions");
class AutocompleteContext extends base_context_1.BaseContext {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "autocomplete", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: functions_1.autocomplete.bind(this)
        });
    }
}
exports.AutocompleteContext = AutocompleteContext;
//# sourceMappingURL=autocomplete.context.js.map