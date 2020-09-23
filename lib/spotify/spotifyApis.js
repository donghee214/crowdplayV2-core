"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverAuth_1 = require("./serverAuth");
const _retryRequest = async (request) => {
    try {
        return await request();
    }
    catch (err) {
        await serverAuth_1.createSpotifyNode();
        return await request();
    }
};
exports.getRecs = async (variables) => {
    return _retryRequest(async () => {
        let songs = await serverAuth_1.spotifyApi.getRecommendations(variables);
        return songs.body.tracks;
    });
};
exports.getSongs = async (variables) => {
    return _retryRequest(async () => {
        let songs = await serverAuth_1.spotifyApi.getTracks(variables);
        return songs.body.tracks.map((song) => {
            song.isRec = false;
            return song;
        });
    });
};
exports.getSong = async (variables) => {
    return _retryRequest(async () => {
        let song = await serverAuth_1.spotifyApi.getTrack(variables);
        return song.body;
    });
};
exports.getPlaylist = async (playlistId) => {
    return _retryRequest(async () => {
        return serverAuth_1.spotifyApi.getPlaylist(playlistId, {
            fields: ["description", "followers", "id", "images", "name", "owner", "uri"]
        });
    });
};
exports.getPlaylistTracks = async (playlistId) => {
    return _retryRequest(async () => {
        return serverAuth_1.spotifyApi.getPlaylistTracks(playlistId);
    });
};
exports.getAlbum = async (albumId) => {
    return _retryRequest(async () => {
        return serverAuth_1.spotifyApi.getAlbum(albumId);
    });
};
exports.getAlbumTracks = async (albumId) => {
    return _retryRequest(async () => {
        return serverAuth_1.spotifyApi.getAlbumTracks(albumId);
    });
};
exports.getArtist = async (artistId) => {
    return _retryRequest(async () => {
        return serverAuth_1.spotifyApi.getArtist(artistId);
    });
};
exports.getArtistTracks = async (artistId) => {
    return _retryRequest(async () => {
        return serverAuth_1.spotifyApi.getArtistTopTracks(artistId, "CA");
    });
};
exports.getArtistAlbums = async (artistId) => {
    return _retryRequest(async () => {
        return serverAuth_1.spotifyApi.getArtistAlbums(artistId);
    });
};
exports.getArtistRelatedArtists = async (artistId) => {
    return _retryRequest(async () => {
        return serverAuth_1.spotifyApi.getArtistRelatedArtists(artistId);
    });
};
exports.getSearch = async ({ q = "", type = [], limit = 20, offset = 0 }) => {
    return _retryRequest(async () => {
        var _a, _b, _c, _d;
        let searchResults = await serverAuth_1.spotifyApi.search(q, type, { limit, offset });
        const ret = {
            artists: (_a = searchResults.body.artists) === null || _a === void 0 ? void 0 : _a.items,
            albums: (_b = searchResults.body.albums) === null || _b === void 0 ? void 0 : _b.items,
            playlists: (_c = searchResults.body.playlists) === null || _c === void 0 ? void 0 : _c.items,
            tracks: (_d = searchResults.body.tracks) === null || _d === void 0 ? void 0 : _d.items
        };
        return ret;
    });
};
exports.getUser = async (userId) => {
    return _retryRequest(async () => {
        return serverAuth_1.spotifyApi.getUser(userId);
    });
};
exports.getMe = async (accessToken) => {
    return _retryRequest(async () => {
        const userSpotifyNode = serverAuth_1.createUserAuthSpotifyNode(accessToken);
        const user = await userSpotifyNode.getMe();
        return user.body;
    });
};
//# sourceMappingURL=spotifyApis.js.map