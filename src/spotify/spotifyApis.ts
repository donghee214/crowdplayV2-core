import { RoomType, UserType, SpotifySongType } from "../models/types"
import { spotifyApi, createSpotifyNode } from './serverAuth'

//TODO CATCH THE TIMEOUT ERROR THEN
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