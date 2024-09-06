"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MirrorReplacements = void 0;
const utils_1 = require("./utils");
var ReplacementLocation;
(function (ReplacementLocation) {
    ReplacementLocation["EVERYWHERE"] = "everywhere";
    ReplacementLocation["MESSAGE_CONTENT"] = "message_content";
    ReplacementLocation["EMBED_AUTHOR"] = "embed_author";
    ReplacementLocation["EMBED_AUTHOR_URL"] = "embed_author_url";
    ReplacementLocation["EMBED_AUTHOR_ICON_URL"] = "embed_author_icon_url";
    ReplacementLocation["EMBED_TITLE"] = "embed_title";
    ReplacementLocation["EMBED_DESCRIPTION"] = "embed_description";
    ReplacementLocation["EMBED_URL"] = "embed_url";
    ReplacementLocation["EMBED_FIELD_NAME"] = "embed_field_name";
    ReplacementLocation["EMBED_FIELD_VALUE"] = "embed_field_value";
    ReplacementLocation["EMBED_IMAGE_URL"] = "embed_image_url";
    ReplacementLocation["EMBED_THUMBNAIL_URL"] = "embed_thumbnail_url";
    ReplacementLocation["EMBED_FOOTER"] = "embed_footer";
    ReplacementLocation["EMBED_FOOTER_ICON_URL"] = "embed_footer_icon_url";
    ReplacementLocation["EMBED_COLOR"] = "embed_color";
})(ReplacementLocation || (ReplacementLocation = {}));
class Replacement {
    constructor(config) {
        this.replace = config.replace == "*" ? /^(.|\n)*/g : new RegExp(config.replace, "gi");
        this.with = config.with;
        this.applyCallback = this.createApplyCallback(config.where);
    }
    apply(message) {
        this.applyCallback(message);
    }
    createApplyCallback(where) {
        switch (where) {
            case undefined:
            case ReplacementLocation.EVERYWHERE:
                return this.replaceEverywhere;
            case ReplacementLocation.MESSAGE_CONTENT:
                return this.replaceContent;
            case ReplacementLocation.EMBED_AUTHOR:
                return this.replaceEmbedAuthor;
            case ReplacementLocation.EMBED_AUTHOR_URL:
                return this.replaceEmbedAuthorUrl;
            case ReplacementLocation.EMBED_AUTHOR_ICON_URL:
                return this.replaceEmbedAuthorIconUrl;
            case ReplacementLocation.EMBED_TITLE:
                return this.replaceEmbedTitle;
            case ReplacementLocation.EMBED_DESCRIPTION:
                return this.replaceEmbedDescription;
            case ReplacementLocation.EMBED_URL:
                return this.replaceEmbedUrl;
            case ReplacementLocation.EMBED_FIELD_NAME:
                return this.replaceEmbedFieldName;
            case ReplacementLocation.EMBED_FIELD_VALUE:
                return this.replaceEmbedFieldValue;
            case ReplacementLocation.EMBED_IMAGE_URL:
                return this.replaceEmbedImageUrl;
            case ReplacementLocation.EMBED_THUMBNAIL_URL:
                return this.replaceEmbedThumbnailUrl;
            case ReplacementLocation.EMBED_FOOTER:
                return this.replaceEmbedFooter;
            case ReplacementLocation.EMBED_FOOTER_ICON_URL:
                return this.replaceEmbedFooterIconUrl;
            case ReplacementLocation.EMBED_COLOR: {
                if (!(0, utils_1.isWildcardRegex)(this.replace) &&
                    !(0, utils_1.isValidHexColor)(this.replace.source)) {
                    throw new Error(`Invalid color in your config.yml (only hex is supported). Replace "${this.replace.source}" with a valid hex color (e.g. #3463D9) to fix this error.`);
                }
                if (!(0, utils_1.isValidHexColor)(this.with)) {
                    throw new Error(`Invalid color in your config.yml (only hex is supported). Replace "${this.with}" with a valid hex color (e.g. #3463D9) to fix this error.`);
                }
                return this.replaceEmbedColor;
            }
            default:
                throw new Error(`Invalid replacement location: ${where}`);
        }
    }
    replaceEverywhere(message) {
        this.replaceContent(message);
        this.replaceEmbedTitle(message);
        this.replaceEmbedAuthor(message);
        this.replaceEmbedAuthorUrl(message);
        this.replaceEmbedAuthorIconUrl(message);
        this.replaceEmbedDescription(message);
        this.replaceEmbedFieldName(message);
        this.replaceEmbedFieldValue(message);
        this.replaceEmbedImageUrl(message);
        this.replaceEmbedThumbnailUrl(message);
        this.replaceEmbedFooter(message);
        this.replaceEmbedFooterIconUrl(message);
        this.replaceEmbedUrl(message);
        this.tryReplaceEmbedColor(message);
    }
    replaceContent(message) {
        message.content = message.content.replace(this.replace, this.with);
    }
    replaceEmbedProperty(message, ...keys) {
        for (const embed of message.embeds) {
            let object = embed;
            for (const key of keys.slice(0, -1)) {
                if (!(object = object[key])) {
                    return;
                }
            }
            const lastProperty = keys[keys.length - 1];
            const propertyValue = object[lastProperty];
            if (propertyValue) {
                object[lastProperty] = propertyValue.replace(this.replace, this.with);
            }
        }
    }
    replaceEmbedAuthor(message) {
        this.replaceEmbedProperty(message, "author", "name");
    }
    replaceEmbedAuthorUrl(message) {
        this.replaceEmbedProperty(message, "author", "url");
    }
    replaceEmbedAuthorIconUrl(message) {
        this.replaceEmbedProperty(message, "author", "iconURL");
    }
    replaceEmbedTitle(message) {
        this.replaceEmbedProperty(message, "title");
    }
    replaceEmbedDescription(message) {
        this.replaceEmbedProperty(message, "description");
    }
    replaceEmbedUrl(message) {
        this.replaceEmbedProperty(message, "url");
    }
    tryReplaceEmbedColor(message) {
        if (!(0, utils_1.isValidHexColor)(this.replace.source)) {
            return;
        }
        if (!(0, utils_1.isValidHexColor)(this.with)) {
            throw new Error(`Invalid color in your config.yml (only hex is supported). Replace "${this.with}" with a valid hex color (e.g. #3463D9) to fix this error.`);
        }
        this.replaceEmbedColor(message);
    }
    replaceEmbedColor(message) {
        for (const embed of message.embeds) {
            const embedColor = embed.hexColor ?? "#000000";
            if ((0, utils_1.isWildcardRegex)(this.replace) ||
                (0, utils_1.hexColorsAreEqual)(embedColor, this.replace.source)) {
                embed.setColor(this.with);
            }
        }
    }
    replaceEmbedFieldName(message) {
        for (const embed of message.embeds) {
            for (const field of embed.fields) {
                field.name = field.name.replace(this.replace, this.with);
            }
        }
    }
    replaceEmbedFieldValue(message) {
        for (const embed of message.embeds) {
            for (const field of embed.fields) {
                field.value = field.value.replace(this.replace, this.with);
            }
        }
    }
    replaceEmbedImageUrl(message) {
        this.replaceEmbedProperty(message, "image", "url");
    }
    replaceEmbedThumbnailUrl(message) {
        this.replaceEmbedProperty(message, "thumbnail", "url");
    }
    replaceEmbedFooter(message) {
        this.replaceEmbedProperty(message, "footer", "text");
    }
    replaceEmbedFooterIconUrl(message) {
        this.replaceEmbedProperty(message, "footer", "iconURL");
    }
}
class MirrorReplacements {
    constructor(replacementsConfig) {
        this.replacements = [];
        this.replacements = Object.values(replacementsConfig).map((config) => new Replacement(config));
    }
    apply(message) {
        for (const replacement of this.replacements) {
            replacement.apply(message);
        }
    }
}
exports.MirrorReplacements = MirrorReplacements;
