import * as admin from 'firebase-admin'
import { TOPIC, pubsub } from "../schema/subscription"
import { getSong } from "../spotify/spotifyApis"
// import * as serviceAccount from "./service-account.json"

const serviceAccount = require('./service-account.json')
const initializeRoomListeners = () => {
    // initialize existing rooms
    admin.firestore().collection("rooms").onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                // add listener for when song is added/deleted in a room
                const room = change.doc.data()
                admin.firestore()
                    .collection(`rooms/${room.id}/songs`) 
                    .onSnapshot((querySnapshot) => {
                        querySnapshot.docChanges().forEach((change) => {
                            if (change.type === 'added') {
                                const song = change.doc.data()
                                if(!song.trackId) return
                                getSong(song.trackId).then((songSpotify) => {
                                    pubsub.publish(TOPIC.SONG_ADDED, { songAdded: {
                                        ...songSpotify,
                                        score: song.score
                                        }, 
                                    roomId: room.id
                                    })
                                })                          
                                return
                            }
                            if(change.type === 'removed'){
                                const song = change.doc.data()
                                pubsub.publish(TOPIC.SONG_REMOVED, { songRemoved: song })
                                return
                            }
                        })
                    })
                console.log("song listeners added for room", room.id)
            }
            if (change.type === 'removed') {
                console.log('Modified city: ', change.doc.data());
            }
        })
    })
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

initializeRoomListeners()

export default admin