"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const config_1 = require("./config");
const config = new config_1.Config("config.yml");
const client = new client_1.MirrorClient(config);
client.login(config.getToken());
