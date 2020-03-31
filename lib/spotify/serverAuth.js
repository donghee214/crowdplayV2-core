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
    // console.log("create spotify node res", data)
    exports.spotifyApi.setAccessToken(data.body['access_token']);
};
exports.createSpotifyNode();
//# sourceMappingURL=serverAuth.js.map