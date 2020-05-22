"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = __importDefault(require("../database/firestore"));
var Vibrant = require('node-vibrant');
exports.default = {
    removeUserInRoom: async (parent, args) => {
        try {
            const roomDoc = await firestore_1.default
                .firestore()
                .collection(`rooms/${args.roomId}/users`)
                .doc(args.userId)
                .delete();
            return "success";
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
        return "success";
    },
    deleteRoom: async (parent, args) => {
        const roomDoc = await firestore_1.default
            .firestore()
            .doc(`rooms/${args.roomId}`)
            .delete();
        return "success";
    },
    addRoom: async (parent, args) => {
        const roomDoc = firestore_1.default
            .firestore()
            .collection('rooms')
            .doc(args.roomId);
        await roomDoc.set(args);
        return roomDoc;
    },
    addUser: async (parent, args) => {
        const userDoc = await firestore_1.default
            .firestore()
            .collection('users')
            .add(args);
        return userDoc;
    },
    addUserToRoom: async (parent, args) => {
        try {
            const roomDoc = await firestore_1.default
                .firestore()
                .collection(`rooms/${args.roomId}/users`)
                .doc(args.userId)
                .set({});
            return "User added to room";
        }
        catch (error) {
            console.error("Error writing document: ", error);
        }
    },
    addSongToRoom: async (parent, args, context) => {
        try {
            const docRef = firestore_1.default
                .firestore()
                .collection(`rooms/${args.roomId}/songs`)
                .doc(args.song.id);
            const songDoc = await docRef.get();
            if (!songDoc.exists) {
                docRef.set({
                    trackId: args.song.id,
                    score: 1,
                    voters: [],
                    song: args.song
                });
                return "Success";
            }
            else {
                return "Song already added";
            }
        }
        catch (error) {
            console.error("Error writing document: ", error);
        }
    },
    upvoteSong: async (parent, args) => {
        const songRef = firestore_1.default
            .firestore()
            .doc(`rooms/${args.roomId}/songs/${args.trackId}`);
        songRef.update({
            score: firestore_1.default.firestore.FieldValue.increment(1)
        });
        return "Success";
    },
    nextSong: async (parent, args) => {
        const songDocs = await firestore_1.default
            .firestore()
            .collection(`rooms/${args.roomId}/songs`)
            .get();
        let nextSong;
        songDocs.docs.forEach(songDoc => {
            const song = songDoc.data();
            if (!nextSong || song.score > nextSong.score) {
                nextSong = song;
            }
        });
        // fetch the song from spotify 
        // const song: SpotifySongType = await getSong(nextSong.trackId)
        // update the current song
        firestore_1.default
            .firestore()
            .doc(`rooms/${args.roomId}`)
            .update({
            currentSong: nextSong
        });
        // remove that song from the collection
        firestore_1.default
            .firestore()
            .doc(`rooms/${args.roomId}/songs/${nextSong.song.id}`)
            .delete();
        // get colour pallette
        const palette = await Vibrant.from(nextSong.song.album.images[0].url).getPalette();
        firestore_1.default
            .firestore()
            .doc(`rooms/${args.roomId}`)
            .update({
            vibrantColour: palette.Vibrant.getRgb(),
            lightVibrantColour: palette.LightVibrant.getRgb(),
            darkVibrantColour: palette.DarkVibrant.getRgb()
        });
        return "Success";
    }
};
//# sourceMappingURL=mutation.js.map