var SpotifyWebApi = require('spotify-web-api-node');

const credentials = {
    clientId : process.env.SPOTIFY_CLIENT_ID,
    clientSecret : process.env.SPOTIFY_CLIENT_SECRET
}

export let spotifyApi;

export const createSpotifyNode = async () => {
    spotifyApi = new SpotifyWebApi(credentials);
    const data = await spotifyApi.clientCredentialsGrant()
    console.log("create spotify node res", data)
    spotifyApi.setAccessToken(data.body['access_token']);
}


createSpotifyNode()