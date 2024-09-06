"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mirror = void 0;
const utils_1 = require("./utils");
const replacements_1 = require("./replacements");
const filters_1 = require("./filters");
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
class MirrorRequirements {
    constructor({ minEmbedsCount = 0, minContentLength = 0, minAttachmentsCount = 0, }) {
        this.minEmbedsCount = minEmbedsCount;
        this.minContentLength = minContentLength;
        this.minAttachmentsCount = minAttachmentsCount;
    }
}
class MirrorOptions {
    constructor({ useWebhookProfile = false, removeAttachments = false, mirrorMessagesFromBots = true, mirrorReplyMessages = true, mirrorMessagesOnEdit = false, }) {
        this.useWebhookProfile = useWebhookProfile;
        this.removeAttachments = removeAttachments;
        this.mirrorMessagesFromBots = mirrorMessagesFromBots;
        this.mirrorReplyMessages = mirrorReplyMessages;
        this.mirrorMessagesOnEdit = mirrorMessagesOnEdit;
    }
}
class Mirror {
    constructor({ webhookUrls = [], requirements = {}, options = {}, replacements = {}, filters = {}, }) {
        this.webhooks = [];
        this.loadWebhooks(webhookUrls);
        this.mirrorRequirements = new MirrorRequirements(requirements);
        this.mirrorOptions = new MirrorOptions(options);
        this.replacements = new replacements_1.MirrorReplacements(replacements);
        this.filters = new filters_1.MirrorFilters(filters);
    }
    shouldMirror(message, isUpdate) {
        return (this.messageMeetsOptions(message, isUpdate) &&
            this.messageMeetsRequirements(message) &&
            this.messageMatchFilters(message) &&
            this.stripMessage(message));
    }
    applyReplacements(message) {
        this.replacements.apply(message);
    }
    dispatchMessage(message, callback) {
        const payloads = this.createMessagePayloads(message);
        for (const webhook of this.webhooks) {
            for (const payload of payloads) {
                webhook
                    .send(payload)
                    .then(() => callback(message))
                    .catch((error) => console.error(error));
            }
        }
    }
    createMessagePayloads(message) {
        const maxContentLength = 2000;
        const payloads = [];
        const payload = {
            content: message.content.length
                ? message.content.substring(0, maxContentLength)
                : undefined,
            files: [...message.attachments.values()],
            embeds: this.fixInvalidEmbeds(message),
        };
        if (!this.mirrorOptions.useWebhookProfile) {
            payload.username = message.author.username;
            payload.avatarURL = message.author.avatarURL() ?? undefined;
        }
        payloads.push(payload);
        const chunks = Math.floor((message.content.length - 1) / maxContentLength);
        for (let i = 0; i < chunks; i++) {
            const payload = {
                content: message.content.substring((i + 1) * maxContentLength, (i + 2) * maxContentLength),
            };
            if (!this.mirrorOptions.useWebhookProfile) {
                payload.username = message.author.username;
                payload.avatarURL = message.author.avatarURL() ?? undefined;
            }
            payloads.push(payload);
        }
        return payloads;
    }
    fixInvalidEmbeds(message) {
        for (const embed of message.embeds) {
            for (const field of embed.fields) {
                if (!field.name.length) {
                    field.name = "\u200B";
                }
                if (!field.value.length) {
                    field.value = "\u200B";
                }
            }
        }
        return message.embeds;
    }
    messageMeetsOptions(message, isUpdate) {
        return ((this.mirrorOptions.mirrorMessagesFromBots || !message.author.bot) &&
            (this.mirrorOptions.mirrorReplyMessages || !message.reference) &&
            (this.mirrorOptions.mirrorMessagesOnEdit || !isUpdate));
    }
    messageMeetsRequirements(message) {
        return (message.content.length >= this.mirrorRequirements.minContentLength &&
            message.embeds.length >= this.mirrorRequirements.minEmbedsCount &&
            message.attachments.size >= this.mirrorRequirements.minAttachmentsCount);
    }
    messageMatchFilters(message) {
        return this.filters.match(message);
    }
    stripMessage(message) {
        if (this.mirrorOptions.removeAttachments) {
            if ((0, utils_1.containsOnlyAttachments)(message)) {
                return false;
            }
            message.attachments.clear();
        }
        if ((0, utils_1.isGif)(message)) {
            message.embeds.pop();
        }
        return true;
    }
    loadWebhooks(webhookUrls) {
        for (const webhookUrl of webhookUrls) {
            this.webhooks.push(new discord_js_selfbot_v13_1.WebhookClient({ url: webhookUrl }));
        }
    }
}
exports.Mirror = Mirror;
