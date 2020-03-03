"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverAuth_1 = require("./serverAuth");
//TODO CATCH THE TIMEOUT ERROR THEN
exports.getRecs = async (variables) => {
    try {
        let songs = await serverAuth_1.spotifyApi.getRecommendations(variables);
        return songs.body.tracks.map((song) => {
            song.score = 0;
            song.isRec = true;
            return song;
        });
    }
    catch (err) {
        if (err.status == 401) {
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
//# sourceMappingURL=spotifyApis.js.map