import admin from "../database/firestore"
import { RoomType, UserType } from "../models/types"
import { getRecs, getSongs, getSearch } from "../spotify/spotifyApis"

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
    }
}