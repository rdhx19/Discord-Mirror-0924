"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MirrorClient = void 0;
const mirror_1 = require("./mirror");
const discord_js_selfbot_v13_1 = require("discord.js-selfbot-v13");
const utils_1 = require("./utils");
class MirrorClient extends discord_js_selfbot_v13_1.Client {
    constructor(config) {
        super({
            checkUpdate: false,
            presence: {
                status: config.getStatus(),
            },
        });
        this.mirrors = new Map();
        this.config = config;
        this.loadMirrors();
        this.on("ready", () => this.onReady());
        this.on("messageCreate", (message) => this.onMessageCreate(message));
        this.on("messageUpdate", (oldMessage, newMessage) => this.onMessageUpdate(oldMessage, newMessage));
    }
    onReady() {
        console.log(`${this.user?.username} is now mirroring >:)!`);
    }
    onMessageCreate(message) {
        this.mirrorMessage(message);
    }
    onMessageUpdate(_oldMessage, newMessage) {
        if (!newMessage.partial) {
            this.mirrorMessage(newMessage, true);
        }
    }
    mirrorMessage(message, isUpdate = false) {
        if (!this.isMirrorableMessage(message)) {
            return;
        }
        const mirror = this.getMirrorFromMessage(message);
        if (!mirror) {
            return;
        }
        if (!mirror.shouldMirror(message, isUpdate)) {
            return;
        }
        try {
            mirror.applyReplacements(message);
        }
        catch (error) {
            console.error(error);
        }
        mirror.dispatchMessage(message, () => this.logMirroredMessage(message));
    }
    getMirrorFromMessage(message) {
        let mirror = this.mirrors.get(message.channelId);
        if (mirror) {
            return mirror;
        }
        const parent = (0, utils_1.getParentChannel)(message);
        if (parent) {
            return this.mirrors.get(parent.id);
        }
        return undefined;
    }
    isMirrorableMessage(message) {
        return (!(0, utils_1.isSystemMessage)(message) &&
            !(0, utils_1.isDirectMessage)(message) &&
            !(0, utils_1.isVisibleOnlyByClient)(message) &&
            !(0, utils_1.isEmptyMessage)(message) &&
            !(0, utils_1.isPublishedMessage)(message));
    }
    logMirroredMessage(message) {
        const logMessage = this.config.getLogMessage();
        if (!logMessage.length) {
            return;
        }
        console.log(logMessage
            .replace("%date%", new Date().toLocaleString())
            .replace("%author%", message.author.username)
            .replace("%server%", message.guild.name)
            .replace("%channel%", message.channel.name));
    }
    loadMirrors() {
        for (const mirrorConfig of this.config.getMirrors()) {
            this.loadMirror(mirrorConfig);
        }
    }
    loadMirror(mirrorConfig) {
        const channelIds = mirrorConfig.channelIds;
        if (!channelIds) {
            return;
        }
        const mirror = new mirror_1.Mirror(mirrorConfig);
        for (const channelId of channelIds) {
            this.mirrors.set(channelId, mirror);
        }
    }
}
exports.MirrorClient = MirrorClient;
