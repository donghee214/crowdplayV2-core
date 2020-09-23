"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = __importDefault(require("../database/firestore"));
const apollo_server_1 = require("apollo-server");
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
        console.log('deleting room');
        const roomDoc = await firestore_1.default
            .firestore()
            .doc(`rooms/${args.roomId}`)
            .delete();
        return "success";
    },
    addRoom: async (parent, args) => {
        const roomsSnapshot = await firestore_1.default.firestore().collection('rooms').get();
        const rooms = roomsSnapshot.docs.map((doc) => doc.data());
        const userHasRoom = rooms.find(room => { var _a, _b; return ((_b = (_a = room) === null || _a === void 0 ? void 0 : _a.admin) === null || _b === void 0 ? void 0 : _b.id) === args.admin.id; });
        if (userHasRoom) {
            throw new apollo_server_1.UserInputError("Please delete old room before creating new one");
        }
        const roomRef = firestore_1.default
            .firestore()
            .collection('rooms')
            .doc(args.id);
        const roomDoc = await roomRef.get();
        if (roomDoc.exists) {
            throw new apollo_server_1.UserInputError("ROOM EXISTS");
        }
        else {
            await roomRef.set(args);
            return roomRef;
        }
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
        console.log('add Song Context', context);
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
        const batch = firestore_1.default.firestore().batch();
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
        // update the current song
        batch.update(firestore_1.default.firestore().doc(`rooms/${args.roomId}`), {
            currentSong: nextSong
        });
        // remove that song from the collection
        batch.delete(firestore_1.default.firestore().doc(`rooms/${args.roomId}/songs/${nextSong.song.id}`));
        batch.commit();
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