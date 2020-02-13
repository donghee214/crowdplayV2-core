import admin from "../database/firestore"
import { Room, User, Song } from "../models/types"
import { RoomType, UserType, SongType } from "./typedefs"
import spotifyApi from "../spotify/serverAuth"
import * as graphql from 'graphql'


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        room: {
            type: RoomType,
            args: { id: { type: GraphQLID }},
            async resolve(parent, args){
                const roomDoc = await admin
                    .firestore()
                    .doc(`rooms/${args.id}`)
                    .get()
                const room = roomDoc.data() as Room
                if(!room){
                    throw new Error('Room does not exist'); 
                }
                return room
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID }},
            async resolve(parent, args){
                const userDoc = await admin
                    .firestore()
                    .doc(`users/${args.id}`)
                    .get()
                const user = userDoc.data() as User || undefined
                return user
            }
        },
        rooms: {
            type: new GraphQLList(RoomType),
            async resolve(parent, args){
                const roomDocs = await admin
                    .firestore()
                    .collection('rooms')
                    .get()
                return roomDocs.docs.map((room) => room.data()) as Room[]
            }
        },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args){
                const userDocs = await admin
                    .firestore()
                    .collection('users')
                    .get()
                return userDocs.docs.map((user) => user.data()) as User[]
            }
        },
        getSongRec: {
            type: new GraphQLList(SongType),
            args: { seed: { type: GraphQLList(GraphQLString) }},
            async resolve(parent, args){
                const songs = await spotifyApi.getRecommendations({
                    seed_genres: args.seed
                })
                return songs.body.tracks.map((song) => song) as Song[]
            }
        }


    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addRoom: {
            type: RoomType,
            args: {
                name: { type: GraphQLString },
                adminId: { type: GraphQLID }
            },
            async resolve(parent, args){
                const roomDoc = await admin
                    .firestore()
                    .collection('rooms')
                    .add({ ...args })
                return roomDoc
            }
        },
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLID },
                currentRoomId: { type: GraphQLID }
            },
            async resolve(parent, args){
                const userDoc = await admin
                    .firestore()
                    .collection('users')
                    .add({ ...args })
                return userDoc
            }
        },
        addUserToRoom: {
            type: GraphQLString,
            args: {
                roomId: { type: GraphQLID },
                userId: { type: GraphQLID },
            },
            async resolve(parent, args){
                try{
                    const roomDoc = await admin
                        .firestore()
                        .collection(`rooms/${args.roomId}/users`)
                        .doc(args.userId)
                        .set({})
                    return "User added to room"
                }
                catch(error){
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
            async resolve(parent, args){
                try{
                    const roomDoc = await admin 
                        .firestore()
                        .collection(`rooms/${args.roomId}/users`)
                        .doc(args.userId)
                        .delete()
                    return "success"
                }
                catch(error){
                    console.error("Error deletin document: ", error);
                }
            }
        },
        deleteUser: {
            type: GraphQLString,
            args: {
                userId: { type: GraphQLID }
            },
            async resolve(parent, args){
                const userDoc = await admin
                    .firestore()
                    .doc(`users/${args.userId}`)
                    .get()
                const user = userDoc.data() as User || undefined
                if(user.currentRoomId){
                    const roomDoc = await admin
                        .firestore()
                        .collection(`rooms/${user.currentRoomId}/users`)
                        .doc(args.userId)
                        .delete()
                }
                await admin
                    .firestore()
                    .doc(`users/${args.userId}`)
                    .delete()
                return "success"
            }
        },
        deleteRoom: {
            type: GraphQLString,
            args: {
                roomId: { type: GraphQLID }
            },
            async resolve(parent, args){
                const roomDoc = await admin
                    .firestore()
                    .doc(`rooms/${args.roomId}`)
                    .delete()
                return "success"
            }
            
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});