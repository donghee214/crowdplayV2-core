import admin from "../database/firestore"
import { Room, User, Song } from "../models/types"
import Spotify from "../spotify/serverAuth"
import * as graphql from "graphql"


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;


export const RoomType = new GraphQLObjectType({
    name: 'Room',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        adminUser: {
            type: UserType,
            async resolve(parent, args){
                const userDoc =  await admin
                    .firestore()
                    .doc(`users/${parent.adminId}`)
                    .get()
                const user = userDoc.data() as User || undefined
                return user
            }
        },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args){
                const userDocs = await admin
                    .firestore()
                    .collection(`rooms/${parent.id}/users`)
                    .get()
                return userDocs.docs.map((user) => user.data()) as User[]
            }
        },
        songs: {
            type: new GraphQLList(SongType),
            async resolve(parent, args){
                const songDocs = await admin
                    .firestore()
                    .collection(`rooms/${parent.id}/songs`)
                    .get()
                return songDocs.docs.map((song) => song.data()) as Song[]
            }
        }
    })
})

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        room: {
            type: RoomType,
            async resolve(parent, args){
                const roomDoc = await admin
                    .firestore()
                    .doc(`users/${parent.currentRoomId}`)
                    .get()
                const room = roomDoc.data() as Room || undefined
                return room
            }
        }

    })
})

export const ImageType = new GraphQLObjectType({ 
    name: "Image",
    fields: () => ({
        height: { type: GraphQLString },
        width: { type: GraphQLString },
        url: { type: GraphQLString }
    })
})

export const AlbumType = new GraphQLObjectType({
    name: "Album",
    fields: () => ({ 
        id: { type: GraphQLID },
        album_type: { type: GraphQLString },
        href: { type: GraphQLString },
        name: { type: GraphQLString },
        images: { type: GraphQLList(ImageType) }
    })
})

export const ArtistType = new GraphQLObjectType({ 
    name: "Artist",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        uri: { type: GraphQLString },
        href: { type: GraphQLString },
        external_urls: { type: GraphQLString },
    })
})

export const SongType = new GraphQLObjectType({
    name: "Song",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        album: { type: AlbumType },
        artists: {type: GraphQLList(ArtistType)},
        duration_ms: { type: GraphQLInt },
        href: { type: GraphQLString },
        popularity: { type: GraphQLInt },
        preview_url: { type: GraphQLString },
        uri: { type: GraphQLString },
        score: { type: GraphQLInt }
    })
})