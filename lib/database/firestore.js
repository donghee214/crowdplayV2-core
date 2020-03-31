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
const serviceAccount = require('./service-account.json');
exports.attachSongListener = (room) => {
    admin.firestore()
        .collection(`rooms/${room.id}/songs`)
        .onSnapshot((querySnapshot) => {
        querySnapshot
            .docChanges()
            .forEach((change) => {
            if (change.type === 'added') {
                const song = change.doc.data();
                if (!song.trackId)
                    return;
                spotifyApis_1.getSong(song.trackId).then((songSpotify) => {
                    // console.log("song spotify", songSpotify)
                    subscription_1.pubsub.publish("SONG_ADDED", { songAdded: Object.assign(Object.assign({}, songSpotify), { score: song.score }),
                        roomId: room.id
                    });
                });
                return;
            }
        });
    });
};
const initializeRoomListeners = async () => {
    const roomsRef = await admin
        .firestore()
        .collection("rooms")
        .get();
    roomsRef.forEach((doc) => {
        const room = doc.data();
        exports.attachSongListener(room);
    });
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
// initializeRoomListeners()
exports.default = admin;
//# sourceMappingURL=firestore.js.map