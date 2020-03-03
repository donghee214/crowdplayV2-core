import admin from "../database/firestore"
import { RoomType, UserType, SongType } from "../models/types"
import { getRecs } from "../spotify/spotifyApis"

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
    // songs: async (parent, args) => {
    //     const songDocs = await admin
    //         .firestore()
    //         .collection(`rooms/${args.id}/songs`)
    //         .get()
    //     return songDocs.docs.map((song) => song.data()) as SongType[]
    // }
}