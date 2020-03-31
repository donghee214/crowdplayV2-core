"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PubSub, withFilter } = require('apollo-server');
exports.pubsub = new PubSub();
var TOPIC;
(function (TOPIC) {
    TOPIC["SONG_ADDED"] = "SONG_ADDED";
    TOPIC["SONG_REMOVED"] = "SONG_REMOVED";
})(TOPIC = exports.TOPIC || (exports.TOPIC = {}));
exports.default = {
    songAdded: {
        subscribe: withFilter(() => exports.pubsub.asyncIterator("SONG_ADDED"), (payload, variables) => {
            return payload.roomId == variables.roomId;
        })
    },
};
//# sourceMappingURL=subscription.js.map