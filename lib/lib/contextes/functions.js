"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUp = exports.deleteMessage = exports.updateMessage = exports.getMessage = exports.autocomplete = exports.createModal = exports.deferWithoutSource = exports.deferWithSource = exports.reply = void 0;
const v10_1 = require("discord-api-types/v10");
const cannotUseError = 'This interaction type cannot use this';
function interactionCallback(type, data) {
    return this.client.rest.post(v10_1.Routes.interactionCallback(this.data.id, this.data.token), {
        body: {
            type,
            data,
        },
    });
}
async function reply(message, returnReply = false) {
    const files = message.attachments;
    delete message.attachments;
    await this.client.rest.post(v10_1.Routes.interactionCallback(this.data.id, this.data.token), {
        files,
        body: {
            type: v10_1.InteractionResponseType.ChannelMessageWithSource,
            data: {
                ...message,
            },
        },
    });
    if (returnReply)
        return await getMessage.bind(this)();
}
exports.reply = reply;
async function deferWithSource(ephemeral) {
    return await interactionCallback.bind(this)(v10_1.InteractionResponseType.DeferredChannelMessageWithSource, {
        flags: ephemeral ? v10_1.MessageFlags.Ephemeral : undefined,
    });
}
exports.deferWithSource = deferWithSource;
async function deferWithoutSource() {
    if (this.data.type !== v10_1.InteractionType.MessageComponent && this.data.type !== v10_1.InteractionType.ModalSubmit)
        throw new Error(cannotUseError);
    return await interactionCallback.bind(this)(v10_1.InteractionResponseType.DeferredMessageUpdate);
}
exports.deferWithoutSource = deferWithoutSource;
async function createModal(modal) {
    if (this.data.type === v10_1.InteractionType.ModalSubmit)
        throw new Error(cannotUseError);
    return await interactionCallback.bind(this)(v10_1.InteractionResponseType.Modal, modal.toJSON());
}
exports.createModal = createModal;
async function autocomplete(choices) {
    if (this.data.type !== v10_1.InteractionType.ApplicationCommandAutocomplete)
        throw new Error(cannotUseError);
    if (choices.length > 25)
        throw new Error('[autocomplete]: Cannot send over 25 choices!');
    return await interactionCallback.bind(this)(v10_1.InteractionResponseType.ApplicationCommandAutocompleteResult, { choices });
}
exports.autocomplete = autocomplete;
/**
 *
 * @param messageId Optional, defaults to the original message
 * @returns {APIMessage}
 */
async function getMessage(messageId) {
    return await this.client.rest.get(v10_1.Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
}
exports.getMessage = getMessage;
/**
 *
 * @param messageId Optional, defaults to the original message
 * @returns {APIMessage}
 */
async function updateMessage(message, messageId) {
    const files = message.attachments;
    delete message.attachments;
    return await this.client.rest.patch(v10_1.Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'), {
        files,
        body: {
            data: {
                ...message,
            },
        },
    });
}
exports.updateMessage = updateMessage;
/**
 *
 * @param messageId Optional, defaults to @original
 * @returns {unknown}
 */
async function deleteMessage(messageId) {
    return await this.client.rest.delete(v10_1.Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
}
exports.deleteMessage = deleteMessage;
async function followUp(message) {
    const files = message.attachments;
    delete message.attachments;
    return await this.client.rest.post(v10_1.Routes.webhook(this.client.applicationId, this.data.token), {
        body: {
            files,
            data: {
                ...message,
            },
        },
    });
}
exports.followUp = followUp;
//# sourceMappingURL=functions.js.map