var SpotifyWebApi = require('spotify-web-api-node');

const credentials = {
    clientId : process.env.SPOTIFY_CLIENT_ID,
    clientSecret : process.env.SPOTIFY_CLIENT_SECRET
}

export let spotifyApi;

export const createSpotifyNode = async () => {
    spotifyApi = new SpotifyWebApi(credentials);
    const data = await spotifyApi.clientCredentialsGrant()
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('data', data)
}

createSpotifyNode()

// this is called when frontend has already gotten access_token
export const createUserAuthSpotifyNode = (access_token) => {
    const userSpotifyNode = new SpotifyWebApi(credentials)
    userSpotifyNode.setAccessToken(access_token)
    return userSpotifyNode
}

