"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = __importDefault(require("../database/firestore"));
const graphql = __importStar(require("graphql"));
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
exports.RoomType = new GraphQLObjectType({
    name: 'Room',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        adminUser: {
            type: exports.UserType,
            async resolve(parent, args) {
                const userDoc = await firestore_1.default
                    .firestore()
                    .doc(`users/${parent.adminId}`)
                    .get();
                const user = userDoc.data() || undefined;
                return user;
            }
        },
        users: {
            type: new GraphQLList(exports.UserType),
            async resolve(parent, args) {
                const userDocs = await firestore_1.default
                    .firestore()
                    .collection(`rooms/${parent.id}/users`)
                    .get();
                return userDocs.docs.map((user) => user.data());
            }
        },
        songs: {
            type: new GraphQLList(exports.SongType),
            async resolve(parent, args) {
                const songDocs = await firestore_1.default
                    .firestore()
                    .collection(`rooms/${parent.id}/songs`)
                    .get();
                return songDocs.docs.map((song) => song.data());
            }
        }
    })
});
exports.UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        room: {
            type: exports.RoomType,
            async resolve(parent, args) {
                const roomDoc = await firestore_1.default
                    .firestore()
                    .doc(`users/${parent.currentRoomId}`)
                    .get();
                const room = roomDoc.data() || undefined;
                return room;
            }
        }
    })
});
exports.ImageType = new GraphQLObjectType({
    name: "Image",
    fields: () => ({
        height: { type: GraphQLString },
        width: { type: GraphQLString },
        url: { type: GraphQLString }
    })
});
exports.AlbumType = new GraphQLObjectType({
    name: "Album",
    fields: () => ({
        id: { type: GraphQLID },
        album_type: { type: GraphQLString },
        href: { type: GraphQLString },
        name: { type: GraphQLString },
        images: { type: GraphQLList(exports.ImageType) }
    })
});
exports.ArtistType = new GraphQLObjectType({
    name: "Artist",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        uri: { type: GraphQLString },
        href: { type: GraphQLString },
        external_urls: { type: GraphQLString },
    })
});
exports.SongType = new GraphQLObjectType({
    name: "Song",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        album: { type: exports.AlbumType },
        artists: { type: GraphQLList(exports.ArtistType) },
        duration_ms: { type: GraphQLInt },
        href: { type: GraphQLString },
        popularity: { type: GraphQLInt },
        preview_url: { type: GraphQLString },
        uri: { type: GraphQLString },
        score: { type: GraphQLInt }
    })
});
//# sourceMappingURL=typedefs.js.map