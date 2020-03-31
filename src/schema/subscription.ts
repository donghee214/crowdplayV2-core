const { PubSub, withFilter } = require('apollo-server');

export const pubsub = new PubSub();

export enum TOPIC{
    SONG_ADDED = "SONG_ADDED",
    SONG_REMOVED = "SONG_REMOVED"
}

export default {
    songAdded: {
        subscribe: withFilter(
            () => pubsub.asyncIterator("SONG_ADDED"),
            (payload, variables) => {
                return payload.roomId == variables.roomId
            }
    )},
}