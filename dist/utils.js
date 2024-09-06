"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexColorsAreEqual = exports.isWildcardRegex = exports.isValidHexColor = exports.isString = exports.containsOnlyAttachments = exports.isGif = exports.isEmptyMessage = exports.isVisibleOnlyByClient = exports.isDirectMessage = exports.isSystemMessage = exports.isPublishedMessage = exports.getParentChannel = void 0;
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
function getParentChannel(message) {
    return (message.channel instanceof discord_js_selfbot_v13_1.GuildChannel) ? message.channel.parent ?? null : null;
}
exports.getParentChannel = getParentChannel;
function isPublishedMessage(message) {
    return message.flags.has(discord_js_selfbot_v13_1.MessageFlags.FLAGS.CROSSPOSTED);
}
exports.isPublishedMessage = isPublishedMessage;
function isSystemMessage(message) {
    return message.system;
}
exports.isSystemMessage = isSystemMessage;
function isDirectMessage(message) {
    return !message.guild;
}
exports.isDirectMessage = isDirectMessage;
function isVisibleOnlyByClient(message) {
    return message.flags.has(discord_js_selfbot_v13_1.MessageFlags.FLAGS.EPHEMERAL);
}
exports.isVisibleOnlyByClient = isVisibleOnlyByClient;
function isEmptyMessage(message) {
    return !message.content.length && !message.embeds.length && !message.attachments.size;
}
exports.isEmptyMessage = isEmptyMessage;
function isGif(message) {
    return message.embeds.length == 1 && message.embeds.at(0)?.provider != null;
}
exports.isGif = isGif;
function containsOnlyAttachments(message) {
    return message.attachments.size > 0 && !message.content.length && !message.embeds.length;
}
exports.containsOnlyAttachments = containsOnlyAttachments;
function isString(value) {
    return typeof value === "string";
}
exports.isString = isString;
function isValidHexColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color);
}
exports.isValidHexColor = isValidHexColor;
function isWildcardRegex(regex) {
    return regex.source == "^(.|\\n)*";
}
exports.isWildcardRegex = isWildcardRegex;
function hexColorsAreEqual(hexColorA, hexColorB, epsilon = 3000) {
    const colorA = parseInt(hexColorA.slice(1));
    const colorB = parseInt(hexColorB.slice(1));
    return Math.abs(colorA - colorB) <= epsilon;
}
exports.hexColorsAreEqual = hexColorsAreEqual;
