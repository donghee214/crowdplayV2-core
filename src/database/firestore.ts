import * as admin from 'firebase-admin'
import { TOPIC, pubsub } from "../schema/subscription"
import { getSong } from "../spotify/spotifyApis"
import { RoomType } from "../models/types"
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

export default admin