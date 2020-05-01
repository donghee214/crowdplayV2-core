import { RoomType, UserType, SpotifySongType } from "../models/types"
import { spotifyApi, createSpotifyNode } from './serverAuth'

// DEPRECIATE THIS FILES TRY AND CATCH BLOCK FOR A WRAPPER FUNCTION TO JUST REDO IT IF CALL FAILS


export const getRecs = async (variables) => {
    try{
        let songs = await spotifyApi.getRecommendations(variables)
        return songs.body.tracks as SpotifySongType[]
    }
    catch(err){
        if(err.statusCode == 401){
            await createSpotifyNode()
            return getRecs(variables)
        }
    }
}


export const getSongs = async(variables: string[]) => {
    try{
        let songs = await spotifyApi.getTracks(variables)
        return songs.body.tracks.map((song) => {
            song.isRec = false
            return song
        }) as SpotifySongType[]
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getSongs(variables)
        }
        console.error(err)
        return []
    }
}

export const getSong = async(variables: string) => {
    try{
        let song = await spotifyApi.getTrack(variables)
        return song.body as SpotifySongType[]
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getSong(variables)
        }
    }
}

export const getPlaylist = async(playlistId: string) => {
    try{
        return spotifyApi.getPlaylist(playlistId, {
            fields: ["description", "followers", "id", "images", "name" , "owner", "uri"]
        })
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getPlaylist(playlistId)
        }
    }
}

export const getPlaylistTracks = async(playlistId: string) => {
    try{
        return spotifyApi.getPlaylistTracks(playlistId)
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getPlaylistTracks(playlistId)
        }
    }
}

export const getAlbum = async(albumId: string) => {
    try{
        return spotifyApi.getAlbum(albumId)
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getAlbum(albumId)
        }
    }
}

export const getAlbumTracks = async(albumId: string) => {
    try{
        return spotifyApi.getAlbumTracks(albumId)
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getAlbumTracks(albumId)
        }
    }
}

export const getArtist = async(artistId: string) => {
    try{
        return await spotifyApi.getArtist(artistId)
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getArtist(artistId)
        }
    }
}

export const getArtistTracks = async(artistId: string) => {
    try{
        return spotifyApi.getArtistTopTracks(artistId, "CA")
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getArtistTracks(artistId)
        }
    }
}

export const getArtistAlbums = async(artistId: string) => {
    try{
        return spotifyApi.getArtistAlbums(artistId)
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getArtistTracks(artistId)
        }
    }
}

export const getArtistRelatedArtists = async(artistId: string) => {
    try{
        return spotifyApi.getArtistRelatedArtists(artistId)
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getArtistRelatedArtists(artistId)
        }
    }
}

export const getSearch = async({
    q = "",
    type = ["track"],
    limit = 20,
    offset = 0
}) => {
    try{
        
        let searchResults = await spotifyApi.search(q, type, { limit, offset })
        const ret = {
            artists: searchResults.body.artists.items,
            albums: searchResults.body.albums.items,
            playlists: searchResults.body.playlists.items,
            tracks: searchResults.body.tracks.items
        }
        return ret
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getSearch({q, type, limit, offset})
        }
    }
}