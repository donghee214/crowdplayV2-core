"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpotifyWebApi = require('spotify-web-api-node');
const credentials = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
};
exports.createSpotifyNode = async () => {
    exports.spotifyApi = new SpotifyWebApi(credentials);
    const data = await exports.spotifyApi.clientCredentialsGrant();
    exports.spotifyApi.setAccessToken(data.body['access_token']);
};
// this is called when frontend has already gotten access_token
exports.createUserAuthSpotifyNode = (access_token) => {
    const userSpotifyNode = new SpotifyWebApi(credentials);
    userSpotifyNode.setAccessToken(access_token);
    return userSpotifyNode;
};
//# sourceMappingURL=serverAuth.js.map