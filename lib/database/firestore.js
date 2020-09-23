"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
require('dotenv').config();
// export const attachSongListener = (room: { id: string }) => {
//     admin.firestore()
//         .collection(`rooms/${room.id}/songs`)
//         .onSnapshot((querySnapshot)=> {
//             querySnapshot
//                 .docChanges()
//                 .forEach((change) => {
//                     if (change.type === 'added') {
//                         const song = change.doc.data()
//                         if(!song.trackId) return
//                         getSong(song.trackId).then((songSpotify) => {
//                             // console.log("song spotify", songSpotify)
//                             pubsub.publish("SONG_ADDED", { songAdded: 
//                                 {
//                                 ...songSpotify,
//                                 score: song.score
//                                 }, 
//                             roomId: room.id
//                             })
//                         })                          
//                         return
//                     }
//             })
//     })
// }
// const initializeRoomListeners = async () => {
//     const roomsRef = await admin
//         .firestore()
//         .collection("rooms")
//         .get()
//     roomsRef.forEach((doc) => {
//         const room = doc.data() as RoomType
//         attachSongListener(room)
//     })
// }
admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        projectId: process.env.FIREBASE_PROJECT_ID,
    })
});
exports.default = admin;
//# sourceMappingURL=firestore.js.map