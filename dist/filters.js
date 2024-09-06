"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MirrorFilters = void 0;
const utils_1 = require("./utils");
var FilterType;
(function (FilterType) {
    FilterType["WHITELIST"] = "whitelist";
    FilterType["BLACKLIST"] = "blacklist";
})(FilterType || (FilterType = {}));
var FilterLocation;
(function (FilterLocation) {
    FilterLocation["MESSAGE"] = "message";
    FilterLocation["POST_TAG"] = "post_tag";
    FilterLocation["USERNAME"] = "username";
    FilterLocation["GUILD_NICKNAME"] = "guild_nickname";
    FilterLocation["USER_ROLES"] = "user_roles";
})(FilterLocation || (FilterLocation = {}));
class Filter {
    constructor({ type, keywords, where }) {
        if (!Object.values(FilterType).includes(type)) {
            throw new Error(`Invalid filter type: ${type}`);
        }
        if (!Object.values(FilterLocation).includes(where)) {
            throw new Error(`Invalid filter location: ${where}`);
        }
        this.type = type;
        this.location = where;
        this.keywords = keywords.map((keyword) => keyword.toLowerCase());
    }
    match(message) {
        switch (this.location) {
            case FilterLocation.MESSAGE:
                return this.messageMatches(message);
            case FilterLocation.POST_TAG:
                return this.postTagMatches(message);
            case FilterLocation.USERNAME:
                return this.usernameMatches(message);
            case FilterLocation.GUILD_NICKNAME:
                return this.nicknameMatches(message);
            case FilterLocation.USER_ROLES:
                return this.userRolesMatch(message);
            default:
                return true;
        }
    }
    messageMatches(message) {
        return this.contentMatches(message) || this.embedsMatch(message);
    }
    contentMatches(message) {
        const content = message.content.toLowerCase();
        return this.stringMatches(content);
    }
    embedsMatch(message) {
        return (message.embeds.length > 0 &&
            message.embeds.every((embed) => this.embedMatches(embed)));
    }
    embedMatches(embed) {
        const fullEmbed = [
            embed.title,
            embed.description,
            embed.fields.map((field) => field.name + field.value).join(""),
            embed.footer?.text,
            embed.author?.name,
        ]
            .join("")
            .toLowerCase();
        return this.stringMatches(fullEmbed);
    }
    postTagMatches(message) {
        const parent = (0, utils_1.getParentChannel)(message);
        if (!parent) {
            return true;
        }
        if (parent.type !== "GUILD_FORUM") {
            return true;
        }
        const channel = message.channel;
        const tags = parent.availableTags
            .filter((tag) => channel.appliedTags.includes(tag.id))
            .map((tag) => tag.name.toLowerCase())
            .join("");
        return this.stringMatches(tags);
    }
    usernameMatches(message) {
        const username = message.author.username.toLowerCase();
        return this.stringMatches(username);
    }
    nicknameMatches(message) {
        if (!message.member) {
            return false;
        }
        const nickname = message.member.displayName.toLowerCase();
        return this.stringMatches(nickname);
    }
    userRolesMatch(message) {
        if (!message.member) {
            return false;
        }
        const roles = message.member.roles.cache
            .map((role) => role.name.toLowerCase())
            .join("");
        return this.stringMatches(roles);
    }
    stringMatches(content) {
        return this.type == FilterType.WHITELIST
            ? this.keywords.some((keyword) => content.includes(keyword))
            : !this.keywords.some((keyword) => content.includes(keyword));
    }
}
class MirrorFilters {
    constructor(filtersConfig) {
        this.filters = [];
        this.filters = Object.values(filtersConfig).map((config) => new Filter(config));
    }
    match(message) {
        return !this.filters.length || this.filters.some((filter) => filter.match(message));
    }
}
exports.MirrorFilters = MirrorFilters;
