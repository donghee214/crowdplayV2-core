import { RoomType, UserType, SpotifySongType } from "../models/types"
import { spotifyApi, createSpotifyNode, createUserAuthSpotifyNode } from './serverAuth'
import { AuthenticationError } from 'apollo-server'

const _retryRequest = async (request) => {
    try{
        return await request()
    }
    catch(err){
        await createSpotifyNode()
        return await request()
    }   
}

export const getRecs = async (variables) => {
    return _retryRequest(async () => {
        let songs = await spotifyApi.getRecommendations(variables)
        return songs.body.tracks as SpotifySongType[]
    })
}

export const getSongs = async(variables: string[]) => {
    return _retryRequest(async () => {
        let songs = await spotifyApi.getTracks(variables)
        return songs.body.tracks.map((song) => {
            song.isRec = false
            return song
        }) as SpotifySongType[] 
    })
}

export const getSong = async(variables: string) => {
    return _retryRequest(async () => {
        let song = await spotifyApi.getTrack(variables)
        return song.body as SpotifySongType[]
    })
}

export const getPlaylist = async(playlistId: string) => {
    return _retryRequest(async () => {
        return spotifyApi.getPlaylist(playlistId, {
            fields: ["description", "followers", "id", "images", "name" , "owner", "uri"]
        })
    })
}

export const getPlaylistTracks = async(playlistId: string) => {
    return _retryRequest(async () => {
        return spotifyApi.getPlaylistTracks(playlistId)
    })
}

export const getAlbum = async(albumId: string) => {
    return _retryRequest(async () => {
        return spotifyApi.getAlbum(albumId)
    })
}

export const getAlbumTracks = async(albumId: string) => {
    return _retryRequest(async () => {
        return spotifyApi.getAlbumTracks(albumId)
    })
}

export const getArtist = async(artistId: string) => {
    return _retryRequest(async () => {
        return spotifyApi.getArtist(artistId)
    })
}

export const getArtistTracks = async(artistId: string) => {
    return _retryRequest(async () => {
        return spotifyApi.getArtistTopTracks(artistId, "CA")
    })
}

export const getArtistAlbums = async(artistId: string) => {
    return _retryRequest(async () => {
        return spotifyApi.getArtistAlbums(artistId)
    })
}

export const getArtistRelatedArtists = async(artistId: string) => {
    return _retryRequest(async () => {
        return spotifyApi.getArtistRelatedArtists(artistId)
    })
}

export const getSearch = async({
    q = "",
    type = [],
    limit = 20,
    offset = 0
}) => {
    return _retryRequest(async () => {
        let searchResults = await spotifyApi.search(q, type, { limit, offset })
        const ret = {
            artists: searchResults.body.artists?.items,
            albums: searchResults.body.albums?.items,
            playlists: searchResults.body.playlists?.items,
            tracks: searchResults.body.tracks?.items
        }
        return ret
    })
}

export const getUser = async(userId: string) => {
    return _retryRequest(async () => {
        return spotifyApi.getUser(userId)
    })
}

export const getMe = async(accessToken: string) => {
    return _retryRequest(async () => {
        const userSpotifyNode = createUserAuthSpotifyNode(accessToken)
        const user = await userSpotifyNode.getMe()
        return user.body as UserType
    })
}