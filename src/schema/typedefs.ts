import admin from "../database/firestore"
import { RoomType, UserType } from "../models/types"
import { gql } from 'apollo-server-express'
import { getRecs, getSongs } from "../spotify/spotifyApis"
import { spotifyApi } from "../spotify/serverAuth"

export const typeDefs = gql`
    input ImageInput {
        height: String
        width: String
        url: String
    }

    input ArtistInput {
        id: ID
        name: String
        uri: String
        href: String
        external_urls: String
    }

    input AlbumInput{
        id: ID
        album_type: String
        href: String
        name: String
        images: [ImageInput]
    }

    input SongInput {
        id: ID
        name: String
        album: AlbumInput
        artists: [ArtistInput]
        duration_ms: Int
        href: String
        popularity: Int
        preview_url: String
        uri: String
    }

    type Room{
        id: ID
        name: String
        adminUser: User
        users: [User]
        songs: [Song]
    }

    type User{
        id: ID
        name: String
        room: Room
    }

    type Image{
        height: String
        width: String
        url: String
    }

    type Album{
        id: ID
        album_type: String
        artists: [Artist]
        href: String
        name: String
        images: [Image]
    }

    type ArtistFollowers{
        total: Int
    }

    type Artist{
        id: ID
        name: String
        uri: String
        href: String
        external_urls: String
        images: [Image]
        followers: ArtistFollowers
        genres: [String]
    }

    type Song{
        trackId: ID
        score: Int
        voters: [String]
        song: SpotifySong
    }

    type SpotifySong{
        id: ID
        name: String
        album: Album
        artists: [Artist]
        duration_ms: Int
        href: String
        popularity: Int
        preview_url: String
        uri: String
    }

    type TrackSummary{
        href: String
        total: Int
    }

    type Subscription {
        songAdded(roomId: ID): Song
        onConnect: String
    }

    type Playlist {
        collaborative: Boolean
        description: String
        href: String
        id: String
        images: [Image]
        name: String
        primary_color: String
        snapshot_id: String
        tracks: TrackSummary
        type: String
        uri: String
    }

    type SeachResult{
        artists: [Artist]
        tracks: [SpotifySong]
        albums: [Album]
        playlists: [Playlist]
    }

    type Query{
        room(id: ID): Room
        user(id: ID): User
        rooms: [Room]
        users: [User]
        songRecs(seed: [String]): [SpotifySong]
        songs(roomId: ID): [Song]
        search(q: String, limit: Int, offset: Int): SeachResult
    }

    type Mutation{
        addRoom(id: String, adminId: ID): Room
        addUser(name: String, currentRoomId: ID): User
        addUserToRoom(roomId: ID, userId: ID): String
        addSongToRoom(roomId: ID, song: SongInput): String
        removeUserInRoom(roomId:ID, userId: ID): String
        deleteUser(userId: ID): String
        deleteRoom(roomId: ID): String
        upvoteSong(roomId: ID!, trackId: ID!): String
        nextSong( roomId: ID!): String
    }
`

const Room = {
    adminUser: async (parent, args) => {
        const userDoc =  await admin
            .firestore()
            .doc(`users/${parent.adminId}`)
            .get()
        const user = userDoc.data() as UserType || undefined
        return user
    },
    songs: async (parent, args) => {
        const songCollection = await admin
            .firestore()
            .collection(`rooms/${parent.id}/songs`)
            .get()
        const songs = songCollection.docs.map((song) => song.data())
        return songs.sort((a, b) => b.score - a.score) 
    },
    users: async (parent, args) => {
        const userDocs = await admin
            .firestore()
            .collection(`rooms/${parent.id}/users`)
            .get()
        return userDocs.docs.map((user) => user.data()) as UserType[]
    }
}

const User = {
    room: async (parent, args) => {
        const roomDoc = await admin
            .firestore()
            .doc(`users/${parent.currentRoomId}`)
            .get()
        const room = roomDoc.data() as RoomType || undefined
        return room
    }
}

const Song = {
    data: async (parent, args) => {
        const roomDoc = await admin
            .firestore()
            .doc(`rooms/${parent.id}/songs`)
            .get()
        const room = roomDoc.data()
        const songIds = room.songs.map((song) => song.trackId)
        const songsComplete = await getSongs(songIds)
        songsComplete.forEach((song, index) => {
            song.score = room.songs[index].score 
        });
        return songsComplete
    }
}

export const typeResolvers = {
    Room,
    User
}

// const {
//     GraphQLObjectType,
//     GraphQLString,
//     GraphQLSchema,
//     GraphQLID,
//     GraphQLInt,
//     GraphQLList,
//     GraphQLNonNull
// } = graphql;


// export const RoomType = new GraphQLObjectType({
//     name: 'Room',
//     fields: () => ({
//         id: { type: GraphQLID },
//         name: { type: GraphQLString },
//         adminUser: {
//             type: UserType,
//             async resolve(parent, args){
//                 const userDoc =  await admin
//                     .firestore()
//                     .doc(`users/${parent.adminId}`)
//                     .get()
//                 const user = userDoc.data() as User || undefined
//                 return user
//             }
//         },
//         users: {
//             type: new GraphQLList(UserType),
//             async resolve(parent, args){
//                 const userDocs = await admin
//                     .firestore()
//                     .collection(`rooms/${parent.id}/users`)
//                     .get()
//                 return userDocs.docs.map((user) => user.data()) as User[]
//             }
//         },
//         songs: {
//             type: new GraphQLList(SongType),
//             async resolve(parent, args){
//                 const songDocs = await admin
//                     .firestore()
//                     .collection(`rooms/${parent.id}/songs`)
//                     .get()
//                 return songDocs.docs.map((song) => song.data()) as Song[]
//             }
//         }
//     })
// })

// export const UserType = new GraphQLObjectType({
//     name: 'User',
//     fields: () => ({
//         id: { type: GraphQLID },
//         name: { type: GraphQLString },
//         room: {
//             type: RoomType,
//             async resolve(parent, args){
//                 const roomDoc = await admin
//                     .firestore()
//                     .doc(`users/${parent.currentRoomId}`)
//                     .get()
//                 const room = roomDoc.data() as Room || undefined
//                 return room
//             }
//         }

//     })
// })

// export const ImageType = new GraphQLObjectType({ 
//     name: "Image",
//     fields: () => ({
//         height: { type: GraphQLString },
//         width: { type: GraphQLString },
//         url: { type: GraphQLString }
//     })
// })

// export const AlbumType = new GraphQLObjectType({
//     name: "Album",
//     fields: () => ({ 
//         id: { type: GraphQLID },
//         album_type: { type: GraphQLString },
//         href: { type: GraphQLString },
//         name: { type: GraphQLString },
//         images: { type: GraphQLList(ImageType) }
//     })
// })

// export const ArtistType = new GraphQLObjectType({ 
//     name: "Artist",
//     fields: () => ({
//         id: { type: GraphQLID },
//         name: { type: GraphQLString },
//         uri: { type: GraphQLString },
//         href: { type: GraphQLString },
//         external_urls: { type: GraphQLString },
//     })
// })

// export const SongType = new GraphQLObjectType({
//     name: "Song",
//     fields: () => ({
//         id: { type: GraphQLID },
//         name: { type: GraphQLString },
//         album: { type: AlbumType },
//         artists: {type: GraphQLList(ArtistType)},
//         duration_ms: { type: GraphQLInt },
//         href: { type: GraphQLString },
//         popularity: { type: GraphQLInt },
//         preview_url: { type: GraphQLString },
//         uri: { type: GraphQLString },
//         score: { type: GraphQLInt }
//     })
// })