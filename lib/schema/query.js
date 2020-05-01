"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = __importDefault(require("../database/firestore"));
const spotifyApis_1 = require("../spotify/spotifyApis");
const graphql_fields_1 = __importDefault(require("graphql-fields"));
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
    },
    song: async (parent, args, context) => {
        return spotifyApis_1.getSong(args.trackId);
    },
    artist: async (parent, args, context, info) => {
        let ret = {};
        let dataIndices = {};
        let requests = [];
        let fieldsQueried = 0;
        const topLevelFields = graphql_fields_1.default(info);
        if (topLevelFields.tracks) {
            requests.push(spotifyApis_1.getArtistTracks(args.artistId));
            dataIndices["tracks"] = requests.length - 1;
            fieldsQueried++;
        }
        if (topLevelFields.albums) {
            requests.push(spotifyApis_1.getArtistAlbums(args.artistId));
            dataIndices["albums"] = requests.length - 1;
            fieldsQueried++;
        }
        if (topLevelFields.relatedArtists) {
            requests.push(spotifyApis_1.getArtistRelatedArtists(args.artistId));
            dataIndices["relatedArtists"] = requests.length - 1;
            fieldsQueried++;
        }
        if (fieldsQueried < Object.keys(topLevelFields).length) {
            requests.push(spotifyApis_1.getArtist(args.artistId));
            dataIndices["data"] = requests.length - 1;
        }
        const apiResults = await Promise.all(requests);
        if (topLevelFields.tracks)
            ret["tracks"] = apiResults[dataIndices["tracks"]].body.tracks;
        if (topLevelFields.albums)
            ret["albums"] = apiResults[dataIndices["albums"]].body.albums;
        if (topLevelFields.relatedArtists)
            ret["relatedArtists"] = apiResults[dataIndices["relatedArtists"]].body.artists;
        if (fieldsQueried < Object.keys(topLevelFields).length)
            ret = Object.assign(Object.assign({}, ret), apiResults[dataIndices["data"]]);
        return ret;
    },
    playlist: async (parent, args, context, info) => {
        let ret = {};
        let dataIndices = {};
        let requests = [];
        let fieldsQueried = 0;
        const topLevelFields = graphql_fields_1.default(info);
        if (topLevelFields.tracks) {
            requests.push(spotifyApis_1.getPlaylistTracks(args.playlistId));
            dataIndices["tracks"] = requests.length - 1;
            fieldsQueried++;
        }
        if (fieldsQueried < Object.keys(topLevelFields).length) {
            requests.push(spotifyApis_1.getPlaylist(args.playlistId));
            dataIndices["data"] = requests.length - 1;
        }
        const apiResults = await Promise.all(requests);
        if (topLevelFields.tracks)
            ret["tracks"] = apiResults[dataIndices["tracks"]].body.items.map((itemDetailed) => itemDetailed.track);
        if (fieldsQueried < Object.keys(topLevelFields).length)
            ret = Object.assign(Object.assign({}, ret), apiResults[dataIndices["data"]]);
        return ret;
    },
    album: async (parent, args, context, info) => {
        let ret = {};
        let dataIndices = {};
        let requests = [];
        let fieldsQueried = 0;
        const topLevelFields = graphql_fields_1.default(info);
        if (topLevelFields.tracks) {
            requests.push(spotifyApis_1.getAlbumTracks(args.albumId));
            dataIndices["tracks"] = requests.length - 1;
            fieldsQueried++;
        }
        if (fieldsQueried < Object.keys(topLevelFields).length) {
            requests.push(spotifyApis_1.getAlbum(args.albumId));
            dataIndices["data"] = requests.length - 1;
        }
        const apiResults = await Promise.all(requests);
        if (topLevelFields.tracks)
            ret["tracks"] = apiResults[dataIndices["tracks"]].body.items;
        if (fieldsQueried < Object.keys(topLevelFields).length)
            ret = Object.assign(Object.assign({}, ret), apiResults[dataIndices["data"]]);
        return ret;
    },
};
//# sourceMappingURL=query.js.map