"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = __importDefault(require("../database/firestore"));
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
        const userDoc = await firestore_1.default
            .firestore()
            .doc(`users/${args.userId}`)
            .get();
        const user = userDoc.data() || undefined;
        if (user.currentRoomId) {
            const roomDoc = await firestore_1.default
                .firestore()
                .collection(`rooms/${user.currentRoomId}/users`)
                .doc(args.userId)
                .delete();
        }
        await firestore_1.default
            .firestore()
            .doc(`users/${args.userId}`)
            .delete();
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
        const roomDoc = await firestore_1.default
            .firestore()
            .collection('rooms')
            .add(Object.assign({}, args));
        return roomDoc;
    },
    addUser: async (parent, args) => {
        const userDoc = await firestore_1.default
            .firestore()
            .collection('users')
            .add(Object.assign({}, args));
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
            const roomDoc = await firestore_1.default
                .firestore()
                .collection(`rooms/${args.roomId}/songs`)
                .doc(args.trackId)
                .set({
                trackId: args.trackId,
                score: 1,
                voters: []
            });
            return "Success";
        }
        catch (error) {
            console.error("Error writing document: ", error);
        }
    }
};
//# sourceMappingURL=mutation.js.map