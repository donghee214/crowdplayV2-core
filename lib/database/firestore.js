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
const subscription_1 = require("../schema/subscription");
const spotifyApis_1 = require("../spotify/spotifyApis");
// import * as serviceAccount from "./service-account.json"
const serviceAccount = require('./service-account.json');
const initializeRoomListeners = () => {
    // initialize existing rooms
    admin.firestore().collection("rooms").onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                // add listener for when song is added/deleted in a room
                const room = change.doc.data();
                admin.firestore()
                    .collection(`rooms/${room.id}/songs`)
                    .onSnapshot((querySnapshot) => {
                    querySnapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const song = change.doc.data();
                            if (!song.trackId)
                                return;
                            spotifyApis_1.getSong(song.trackId).then((songSpotify) => {
                                subscription_1.pubsub.publish(subscription_1.TOPIC.SONG_ADDED, { songAdded: Object.assign(Object.assign({}, songSpotify), { score: song.score }),
                                    roomId: room.id
                                });
                            });
                            return;
                        }
                        if (change.type === 'removed') {
                            const song = change.doc.data();
                            subscription_1.pubsub.publish(subscription_1.TOPIC.SONG_REMOVED, { songRemoved: song });
                            return;
                        }
                    });
                });
                console.log("song listeners added for room", room.id);
            }
            if (change.type === 'removed') {
                console.log('Modified city: ', change.doc.data());
            }
        });
    });
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
initializeRoomListeners();
exports.default = admin;
//# sourceMappingURL=firestore.js.map