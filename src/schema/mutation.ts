import admin from "../database/firestore"
import { UserInputError } from 'apollo-server'
import { UserType, SongType, SpotifySongType, RoomType } from "../models/types"
import { getSong } from "../spotify/spotifyApis"
import { firestore } from "firebase-admin"
var Vibrant = require('node-vibrant')

export default {
    removeUserInRoom: async (parent, args) => {
        try {
            const roomDoc = await admin
                .firestore()
                .collection(`rooms/${args.roomId}/users`)
                .doc(args.userId)
                .delete()
            return "success"
        }
        catch (error) {
            console.error("Error deletin document: ", error);
        }
    },
    deleteUser: async (parent, args) => {
        // const userDoc = await admin
        //     .firestore()
        //     .doc(`users/${args.userId}`)
        //     .get()
        // const user = userDoc.data() as UserType || undefined
        // if(user.currentRoomId){
        //     const roomDoc = await admin
        //         .firestore()
        //         .collection(`rooms/${user.currentRoomId}/users`)
        //         .doc(args.userId)
        //         .delete()
        // }
        // await admin
        //     .firestore()
        //     .doc(`users/${args.userId}`)
        //     .delete()
        return "success"
    },
    deleteRoom: async (parent, args) => {
        console.log('deleting room')
        const roomDoc = await admin
            .firestore()
            .doc(`rooms/${args.roomId}`)
            .delete()
        return "success"
    },
    addRoom: async (parent, args: { id: string, admin: UserType }) => {
        const roomsSnapshot = await admin.firestore().collection('rooms').get()
        const rooms = roomsSnapshot.docs.map((doc): RoomType => doc.data() as RoomType)
        const userHasRoom = rooms.find(room => room?.admin?.id === args.admin.id)
        if(userHasRoom){
            throw new UserInputError("Please delete old room before creating new one")
        }
        const roomRef = admin
            .firestore()
            .collection('rooms')
            .doc(args.id)
        const roomDoc = await roomRef.get()
        if (roomDoc.exists) {
            throw new UserInputError("ROOM EXISTS")
        }
        else {
            await roomRef.set(args)
            return roomRef
        }
    },
    addUser: async (parent, args) => {
        const userDoc = await admin
            .firestore()
            .collection('users')
            .add(args)
        return userDoc
    },
    addUserToRoom: async (parent, args) => {
        try {
            const roomDoc = await admin
                .firestore()
                .collection(`rooms/${args.roomId}/users`)
                .doc(args.userId)
                .set({})
            return "User added to room"
        }
        catch (error) {
            console.error("Error writing document: ", error);
        }
    },
    addSongToRoom: async (
        parent,
        args: { song: SpotifySongType, roomId: string },
        context
    ) => {
        console.log('add Song Context', context)
        try {
            const docRef = admin
                .firestore()
                .collection(`rooms/${args.roomId}/songs`)
                .doc(args.song.id)
            const songDoc = await docRef.get()
            if (!songDoc.exists) {
                docRef.set({
                    trackId: args.song.id,
                    score: 1,
                    voters: [],
                    song: args.song
                })
                return "Success"
            }
            else {
                return "Song already added"
            }

        }
        catch (error) {
            console.error("Error writing document: ", error);
        }
    },
    upvoteSong: async (parent, args: { roomId: string, trackId: string }) => {
        const songRef = admin
            .firestore()
            .doc(`rooms/${args.roomId}/songs/${args.trackId}`)
        songRef.update({
            score: admin.firestore.FieldValue.increment(1)
        })
        return "Success"
    },
    nextSong: async (parent, args: { roomId: string }) => {
        const batch = admin.firestore().batch()
        const songDocs = await admin
            .firestore()
            .collection(`rooms/${args.roomId}/songs`)
            .get()
        let nextSong: SongType;
        songDocs.docs.forEach(songDoc => {
            const song = songDoc.data() as SongType
            if (!nextSong || song.score > nextSong.score) {
                nextSong = song
            }
        });

        // update the current song
        batch.update(admin.firestore().doc(`rooms/${args.roomId}`), {
            currentSong: nextSong
        })

        // remove that song from the collection
        batch.delete(admin.firestore().doc(`rooms/${args.roomId}/songs/${nextSong.song.id}`))
        batch.commit()

        // get colour pallette
        const palette = await Vibrant.from(nextSong.song.album.images[0].url).getPalette()
        admin
            .firestore()
            .doc(`rooms/${args.roomId}`)
            .update({
                vibrantColour: palette.Vibrant.getRgb(),
                lightVibrantColour: palette.LightVibrant.getRgb(),
                darkVibrantColour: palette.DarkVibrant.getRgb()
            })
        return "Success"
    }
}