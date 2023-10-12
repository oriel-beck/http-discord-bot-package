"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContext = void 0;
const v10_1 = require("discord-api-types/v10");
const cannotUseError = 'This interaction type cannot use this';
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
    }
    async reply(message, returnReply = false) {
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
            return await this.getMessage();
    }
    async deferWithSource(ephemeral) {
        return await this.interactionCallback(v10_1.InteractionResponseType.DeferredChannelMessageWithSource, { flags: ephemeral ? v10_1.MessageFlags.Ephemeral : undefined });
    }
    async deferUpdate() {
        if (this.data.type !== v10_1.InteractionType.MessageComponent && this.data.type !== v10_1.InteractionType.ModalSubmit)
            throw new Error(cannotUseError);
        return await this.interactionCallback(v10_1.InteractionResponseType.DeferredMessageUpdate);
    }
    async createModal(modal) {
        if (this.data.type === v10_1.InteractionType.ModalSubmit)
            throw new Error(cannotUseError);
        return await this.interactionCallback(v10_1.InteractionResponseType.Modal, modal.toJSON());
    }
    async autocomplete(choices) {
        if (this.data.type !== v10_1.InteractionType.ApplicationCommandAutocomplete)
            throw new Error(cannotUseError);
        if (choices.length > 25)
            throw new Error("[autocomplete]: Cannot send over 25 choices!");
        return await this.interactionCallback(v10_1.InteractionResponseType.ApplicationCommandAutocompleteResult, { choices });
    }
    /**
     *
     * @param messageId Optional, defaults to the original message
     * @returns {APIMessage}
     */
    async getMessage(messageId) {
        return await this.client.rest.get(v10_1.Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
    }
    /**
     *
     * @param messageId Optional, defaults to the original message
     * @returns {APIMessage}
     */
    async updateMessage(message, messageId) {
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
    /**
     *
     * @param messageId Optional, defaults to @original
     * @returns {unknown}
     */
    async deleteMessage(messageId) {
        return await this.client.rest.delete(v10_1.Routes.webhookMessage(this.client.applicationId, this.data.token, messageId || '@original'));
    }
    async followUp(message) {
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
    // TODO: add premium required when available
    interactionCallback(type, data) {
        return this.client.rest.post(v10_1.Routes.interactionCallback(this.data.id, this.data.token), {
            body: {
                type,
                data,
            },
        });
    }
}
exports.BaseContext = BaseContext;
//# sourceMappingURL=base.context.js.map