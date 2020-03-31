"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = __importDefault(require("../database/firestore"));
const spotifyApis_1 = require("../spotify/spotifyApis");
exports.default = {
    room: async (parent, args) => {
        const roomDoc = await firestore_1.default
            .firestore()
            .doc(`rooms/${args.id}`)
            .get();
        const room = roomDoc.data();
        if (!room) {
            throw new Error('Room does not exist');
        }
        return room;
    },
    user: async (parent, args) => {
        const userDoc = await firestore_1.default
            .firestore()
            .doc(`users/${args.id}`)
            .get();
        const user = userDoc.data() || undefined;
        return user;
    },
    rooms: async (parent, args) => {
        const userDocs = await firestore_1.default
            .firestore()
            .collection('users')
            .get();
        return userDocs.docs.map((user) => user.data());
    },
    songRecs: async (parent, args) => {
        return spotifyApis_1.getRecs({
            seed_genres: args.seed,
            limit: 50
        });
    },
    search: async (parent, args) => {
        console.log(args);
        return spotifyApis_1.getSearch({
            q: args.q,
            type: ["album", "artist", "playlist", "track"],
            limit: args.limit,
            offset: args.offset
        });
    },
    songs: async (parent, args) => {
        const songCollection = await firestore_1.default
            .firestore()
            .collection(`rooms/${args.roomId}/songs`)
            .get();
        const songs = songCollection.docs.map((song) => song.data());
        return songs.sort((a, b) => b.score - a.score);
    }
};
//# sourceMappingURL=query.js.map