"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverAuth_1 = require("./serverAuth");
// DEPRECIATE THIS FILES TRY AND CATCH BLOCK FOR A WRAPPER FUNCTION TO JUST REDO IT IF CALL FAILS
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
exports.getPlaylist = async (playlistId) => {
    try {
        return serverAuth_1.spotifyApi.getPlaylist(playlistId, {
            fields: ["description", "followers", "id", "images", "name", "owner", "uri"]
        });
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getPlaylist(playlistId);
        }
    }
};
exports.getPlaylistTracks = async (playlistId) => {
    try {
        return serverAuth_1.spotifyApi.getPlaylistTracks(playlistId);
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getPlaylistTracks(playlistId);
        }
    }
};
exports.getAlbum = async (albumId) => {
    try {
        return serverAuth_1.spotifyApi.getAlbum(albumId);
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getAlbum(albumId);
        }
    }
};
exports.getAlbumTracks = async (albumId) => {
    try {
        return serverAuth_1.spotifyApi.getAlbumTracks(albumId);
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getAlbumTracks(albumId);
        }
    }
};
exports.getArtist = async (artistId) => {
    try {
        return await serverAuth_1.spotifyApi.getArtist(artistId);
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getArtist(artistId);
        }
    }
};
exports.getArtistTracks = async (artistId) => {
    try {
        return serverAuth_1.spotifyApi.getArtistTopTracks(artistId, "CA");
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getArtistTracks(artistId);
        }
    }
};
exports.getArtistAlbums = async (artistId) => {
    try {
        return serverAuth_1.spotifyApi.getArtistAlbums(artistId);
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getArtistTracks(artistId);
        }
    }
};
exports.getArtistRelatedArtists = async (artistId) => {
    try {
        return serverAuth_1.spotifyApi.getArtistRelatedArtists(artistId);
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getArtistRelatedArtists(artistId);
        }
    }
};
exports.getSearch = async ({ q = "", type = ["track"], limit = 20, offset = 0 }) => {
    try {
        let searchResults = await serverAuth_1.spotifyApi.search(q, type, { limit, offset });
        const ret = {
            artists: searchResults.body.artists.items,
            albums: searchResults.body.albums.items,
            playlists: searchResults.body.playlists.items,
            tracks: searchResults.body.tracks.items
        };
        return ret;
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getSearch({ q, type, limit, offset });
        }
    }
};
exports.getUser = async (userId) => {
    try {
        return serverAuth_1.spotifyApi.getUser(userId);
    }
    catch (err) {
        if (err.status == 401) {
            await serverAuth_1.createSpotifyNode();
            return exports.getUser(userId);
        }
    }
};
exports.getMe = async (accessToken) => {
    try {
        const userSpotifyNode = serverAuth_1.createUserAuthSpotifyNode(accessToken);
        const user = await userSpotifyNode.getMe();
        return user.body;
    }
    catch (err) {
        console.error(err);
    }
};
//# sourceMappingURL=spotifyApis.js.map