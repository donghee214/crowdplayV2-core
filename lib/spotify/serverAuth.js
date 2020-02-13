"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});
spotifyApi.clientCredentialsGrant().then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
}, function (err) {
    console.log('Something went wrong when retrieving an access token', err.message);
});
exports.default = spotifyApi;
//# sourceMappingURL=serverAuth.js.map