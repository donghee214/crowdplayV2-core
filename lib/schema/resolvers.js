"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("./query"));
const mutation_1 = __importDefault(require("./mutation"));
const subscription_1 = __importDefault(require("./subscription"));
const typedefs_1 = require("./typedefs");
// const { PubSub } = require('apollo-server');
exports.default = Object.assign({ Query: query_1.default, Mutation: mutation_1.default, Subscription: subscription_1.default }, typedefs_1.typeResolvers);
//# sourceMappingURL=resolvers.js.map