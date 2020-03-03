import { RoomType, UserType, SongType } from "../models/types"
import { spotifyApi, createSpotifyNode } from './serverAuth'

//TODO CATCH THE TIMEOUT ERROR THEN
export const getRecs = async (variables) => {
    try{
        let songs = await spotifyApi.getRecommendations(variables)
        return songs.body.tracks.map((song) => {
            song.score = 0
            song.isRec = true
            return song
        }) as SongType[]
    }
    catch(err){
        if(err.status == 401){
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
        }) as SongType[]
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getSongs(variables)
        }
    }
}

export const getSong = async(variables: string) => {
    try{
        let song = await spotifyApi.getTrack(variables)
        return song.body as SongType[]
    }
    catch(err){
        if(err.status == 401){
            await createSpotifyNode()
            return getSong(variables)
        }
    }
}