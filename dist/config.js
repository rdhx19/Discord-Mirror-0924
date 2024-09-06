"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
class Config {
    constructor(path) {
        this.mirrors = [];
        const file = fs_1.default.readFileSync(path, "utf-8");
        const config = yaml_1.default.parse(file);
        this.token = config.token;
        this.status = config.status;
        this.logMessage = config.logMessage;
        for (const key in config.mirrors) {
            const mirror = config.mirrors[key];
            this.mirrors.push(mirror);
        }
    }
    getToken() {
        return this.token;
    }
    getStatus() {
        return this.status;
    }
    getLogMessage() {
        return this.logMessage;
    }
    getMirrors() {
        return this.mirrors;
    }
}
exports.Config = Config;
