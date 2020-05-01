import admin from "../database/firestore"
import { RoomType, UserType } from "../models/types"
import { getRecs, getSong, getSearch, getArtist, getPlaylist, getAlbum, getAlbumTracks, getArtistTracks, getArtistAlbums, getArtistRelatedArtists, getPlaylistTracks } from "../spotify/spotifyApis"
import { spotifyApi } from "../spotify/serverAuth"
import graphqlFields from "graphql-fields"

export default {
    room: async (parent, args) => {
        const roomDoc = await admin
            .firestore()
            .doc(`rooms/${args.id}`)
            .get()
        const room = roomDoc.data() as RoomType
        if(!room){
            throw new Error('Room does not exist'); 
        }
        return room
    },
    user: async (parent, args) => {
        const userDoc = await admin
            .firestore()
            .doc(`users/${args.id}`)
            .get()
        const user = userDoc.data() as UserType || undefined
        return user
    },
    rooms: async (parent, args) => {
        const userDocs = await admin
            .firestore()
            .collection('users')
            .get()
        return userDocs.docs.map((user) => user.data()) as UserType[]
    },
    songRecs: async (parent, args) =>{
        return getRecs({
            seed_genres: args.seed,
            limit: 50
        })
    },
    search: async (parent, args) => {
        return getSearch({ 
            q: args.q, 
            type: ["album", "artist", "playlist", "track"], 
            limit: args.limit,
            offset: args.offset
        })
    },
    songs: async (parent, args) => {
        const songCollection = await admin
            .firestore()
            .collection(`rooms/${args.roomId}/songs`)
            .get()
        const songs = songCollection.docs.map((song) => song.data())
        return songs.sort((a, b) => b.score - a.score)
    },
    song: async (parent, args, context) => {
        return getSong(args.trackId)
    },
    artist: async (parent, args, context, info) => {
        let ret = {}
        let dataIndices = {}
        let requests = []
        let fieldsQueried = 0
        const topLevelFields = graphqlFields(info)
        if(topLevelFields.tracks){
            requests.push(getArtistTracks(args.artistId))
            dataIndices["tracks"] = requests.length - 1
            fieldsQueried++
        }
        if(topLevelFields.albums){
            requests.push(getArtistAlbums(args.artistId))
            dataIndices["albums"] = requests.length - 1
            fieldsQueried++
        }
        if(topLevelFields.relatedArtists){
            requests.push(getArtistRelatedArtists(args.artistId))
            dataIndices["relatedArtists"] = requests.length - 1
            fieldsQueried++
        }
        if(fieldsQueried < Object.keys(topLevelFields).length){
            requests.push(getArtist(args.artistId))
            dataIndices["data"] = requests.length - 1
        }
        const apiResults = await Promise.all(requests)
        if(topLevelFields.tracks) ret["tracks"] = apiResults[dataIndices["tracks"]].body.tracks
        if(topLevelFields.albums) ret["albums"] = apiResults[dataIndices["albums"]].body.albums
        if(topLevelFields.relatedArtists) ret["relatedArtists"] = apiResults[dataIndices["relatedArtists"]].body.artists
        if(fieldsQueried < Object.keys(topLevelFields).length) ret = { ...ret, ...apiResults[dataIndices["data"]]}
        return ret
    },
    playlist: async (parent, args, context, info) => {
        let ret = {}
        let dataIndices = {}
        let requests = []
        let fieldsQueried = 0
        const topLevelFields = graphqlFields(info)
        if(topLevelFields.tracks){
            requests.push(getPlaylistTracks(args.playlistId))
            dataIndices["tracks"] = requests.length - 1
            fieldsQueried++
        }
        if(fieldsQueried < Object.keys(topLevelFields).length){
            requests.push(getPlaylist(args.playlistId))
            dataIndices["data"] = requests.length - 1
        }
        const apiResults = await Promise.all(requests)
        if(topLevelFields.tracks) ret["tracks"] = apiResults[dataIndices["tracks"]].body.items.map((itemDetailed) => itemDetailed.track)
        if(fieldsQueried < Object.keys(topLevelFields).length) ret = { ...ret, ...apiResults[dataIndices["data"]]}
        return ret
    },
    album: async (parent, args, context, info) => {
        let ret = {}
        let dataIndices = {}
        let requests = []
        let fieldsQueried = 0
        const topLevelFields = graphqlFields(info)
        if(topLevelFields.tracks){
            requests.push(getAlbumTracks(args.albumId))
            dataIndices["tracks"] = requests.length - 1
            fieldsQueried++
        }
        if(fieldsQueried < Object.keys(topLevelFields).length){
            requests.push(getAlbum(args.albumId))
            dataIndices["data"] = requests.length - 1
        }
        const apiResults = await Promise.all(requests)
        if(topLevelFields.tracks) ret["tracks"] = apiResults[dataIndices["tracks"]].body.items
        if(fieldsQueried < Object.keys(topLevelFields).length) ret = { ...ret, ...apiResults[dataIndices["data"]]}
        return ret
    },
}