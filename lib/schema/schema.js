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
const typedefs_1 = require("./typedefs");
const serverAuth_1 = __importDefault(require("../spotify/serverAuth"));
const graphql = __importStar(require("graphql"));
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        room: {
            type: typedefs_1.RoomType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                const roomDoc = await firestore_1.default
                    .firestore()
                    .doc(`rooms/${args.id}`)
                    .get();
                const room = roomDoc.data();
                if (!room) {
                    throw new Error('Room does not exist');
                }
                return room;
            }
        },
        user: {
            type: typedefs_1.UserType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                const userDoc = await firestore_1.default
                    .firestore()
                    .doc(`users/${args.id}`)
                    .get();
                const user = userDoc.data() || undefined;
                return user;
            }
        },
        rooms: {
            type: new GraphQLList(typedefs_1.RoomType),
            async resolve(parent, args) {
                const roomDocs = await firestore_1.default
                    .firestore()
                    .collection('rooms')
                    .get();
                return roomDocs.docs.map((room) => room.data());
            }
        },
        users: {
            type: new GraphQLList(typedefs_1.UserType),
            async resolve(parent, args) {
                const userDocs = await firestore_1.default
                    .firestore()
                    .collection('users')
                    .get();
                return userDocs.docs.map((user) => user.data());
            }
        },
        getSongRec: {
            type: new GraphQLList(typedefs_1.SongType),
            args: { seed: { type: GraphQLList(GraphQLString) } },
            async resolve(parent, args) {
                const songs = await serverAuth_1.default.getRecommendations({
                    seed_genres: args.seed
                });
                return songs.body.tracks.map((song) => song);
            }
        }
    }
});
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addRoom: {
            type: typedefs_1.RoomType,
            args: {
                name: { type: GraphQLString },
                adminId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                const roomDoc = await firestore_1.default
                    .firestore()
                    .collection('rooms')
                    .add(Object.assign({}, args));
                return roomDoc;
            }
        },
        addUser: {
            type: typedefs_1.UserType,
            args: {
                name: { type: GraphQLID },
                currentRoomId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                const userDoc = await firestore_1.default
                    .firestore()
                    .collection('users')
                    .add(Object.assign({}, args));
                return userDoc;
            }
        },
        addUserToRoom: {
            type: GraphQLString,
            args: {
                roomId: { type: GraphQLID },
                userId: { type: GraphQLID },
            },
            async resolve(parent, args) {
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
            }
        },
        removeUserInRoom: {
            type: GraphQLString,
            args: {
                roomId: { type: GraphQLID },
                userId: { type: GraphQLID }
            },
            async resolve(parent, args) {
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
            }
        },
        deleteUser: {
            type: GraphQLString,
            args: {
                userId: { type: GraphQLID }
            },
            async resolve(parent, args) {
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
            }
        },
        deleteRoom: {
            type: GraphQLString,
            args: {
                roomId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                const roomDoc = await firestore_1.default
                    .firestore()
                    .doc(`rooms/${args.roomId}`)
                    .delete();
                return "success";
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
//# sourceMappingURL=schema.js.map