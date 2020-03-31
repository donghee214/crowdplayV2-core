"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverAuth_1 = require("./serverAuth");
//TODO CATCH THE TIMEOUT ERROR THEN
exports.getRecs = async (variables) => {
    try {
        let songs = await serverAuth_1.spotifyApi.getRecommendations(variables);
        return songs.body.tracks;
    }
    catch (err) {
        if (err.statusCode == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getRecs(variables);
        }
    }
};
exports.getSongs = async (variables) => {
    try {
        let songs = await serverAuth_1.spotifyApi.getTracks(variables);
        return songs.body.tracks.map((song) => {
            song.isRec = false;
            return song;
        });
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getSongs(variables);
        }
        console.error(err);
        return [];
    }
};
exports.getSong = async (variables) => {
    try {
        let song = await serverAuth_1.spotifyApi.getTrack(variables);
        return song.body;
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getSong(variables);
        }
    }
};
exports.getSearch = async ({ q = "", type = ["track"], limit = 20, offset = 0 }) => {
    try {
        let searchResults = await serverAuth_1.spotifyApi.search(q, type, { limit, offset });
        console.log(searchResults);
        const ret = {
            artists: searchResults.body.artists.items,
            albums: searchResults.body.albums.items,
            playlists: searchResults.body.playlists.items,
            tracks: searchResults.body.tracks.items
        };
        console.log(ret);
        return ret;
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getSearch({ q, type, limit, offset });
        }
    }
};
//# sourceMappingURL=spotifyApis.js.map