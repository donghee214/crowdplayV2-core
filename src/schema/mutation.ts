import admin from "../database/firestore"
import { UserType } from "../models/types"

export default {
    removeUserInRoom: async (parent, args) => {
        try{
            const roomDoc = await admin 
                .firestore()
                .collection(`rooms/${args.roomId}/users`)
                .doc(args.userId)
                .delete()
            return "success"
        }
        catch(error){
            console.error("Error deletin document: ", error);
        }
    },
    deleteUser: async (parent, args) => {
        const userDoc = await admin
            .firestore()
            .doc(`users/${args.userId}`)
            .get()
        const user = userDoc.data() as UserType || undefined
        if(user.currentRoomId){
            const roomDoc = await admin
                .firestore()
                .collection(`rooms/${user.currentRoomId}/users`)
                .doc(args.userId)
                .delete()
        }
        await admin
            .firestore()
            .doc(`users/${args.userId}`)
            .delete()
        return "success"
    },
    deleteRoom: async (parent, args) => {
        const roomDoc = await admin
            .firestore()
            .doc(`rooms/${args.roomId}`)
            .delete()
        return "success"
    },
    addRoom: async (parent, args) => {
        const roomDoc = await admin
            .firestore()
            .collection('rooms')
            .add({ ...args })
        return roomDoc
    },
    addUser: async (parent, args) => {
        const userDoc = await admin
            .firestore()
            .collection('users')
            .add({ ...args })
        return userDoc
    },
    addUserToRoom: async (parent, args) => {
        try{
            const roomDoc = await admin
                .firestore()
                .collection(`rooms/${args.roomId}/users`)
                .doc(args.userId)
                .set({})
            return "User added to room"
        }
        catch(error){
            console.error("Error writing document: ", error);
        }
    },
    addSongToRoom: async (
            parent,
            args: { trackId: string, roomId: string },
            context
        ) => {
        try{
            const roomDoc = await admin
                .firestore()
                .collection(`rooms/${args.roomId}/songs`)
                .doc(args.trackId)
                .set({
                    trackId: args.trackId,
                    score: 1,
                    voters: []
                })
            return "Success"
        }
        catch(error){
            console.error("Error writing document: ", error);
        }
    }
}