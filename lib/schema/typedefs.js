"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = __importDefault(require("../database/firestore"));
const apollo_server_express_1 = require("apollo-server-express");
const spotifyApis_1 = require("../spotify/spotifyApis");
exports.typeDefs = apollo_server_express_1.gql `
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
        display_name: String
        images: [Image]
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
        tracks: [SpotifySong]
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
        followers: ArtistFollowers
        images: [Image]
        genres: [String]
        albums: [Album]
        tracks: [SpotifySong]
        relatedArtists: [Artist]
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

    type Subscription {
        songAdded(roomId: ID): Song
        onConnect: String
    }

    type Owner{
        display_name: String
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
        tracks: [SpotifySong]
        type: String
        uri: String
        owner: Owner
    }

    type SeachResult{
        artists: [Artist]
        tracks: [SpotifySong]
        albums: [Album]
        playlists: [Playlist]
    }

    type AuthUrl{
        url: String
    }

    type Query{
        room(id: ID): Room
        user(id: ID): User
        authorize(scopes: [String], redirectUri: String): String
        me(accessToken: String): User
        rooms: [Room]
        users: [User]
        songRecs(seed: [String]): [SpotifySong]
        songs(roomId: ID): [Song]
        search(q: String, limit: Int, offset: Int): SeachResult
        song(trackId: ID!): SpotifySong
        album(albumId: ID!): Album
        playlist(playlistId: ID!): Playlist
        artist(artistId: ID!): Artist
        getAuthorizeUrl(scopes: [String], redirectUri: String): AuthUrl
    }

    type Mutation {
        addRoom(roomId: String, adminId: ID): Room
        addUser(name: String, currentRoomId: ID): User
        addUserToRoom(roomId: ID, userId: ID): String
        addSongToRoom(roomId: ID, song: SongInput): String
        removeUserInRoom(roomId:ID, userId: ID): String
        deleteUser(userId: ID): String
        deleteRoom(roomId: ID): String
        upvoteSong(roomId: ID!, trackId: ID!): String
        nextSong(roomId: ID!): String
    }
`;
// FALLBACK TYPE RESOLVERS, IF THE OPTIMIZATION OF CALLING THE APIS IN PARALLEL FAILS
const Album = {
    tracks: async (parent, args) => {
        if (!parent.tracks)
            return spotifyApis_1.getAlbumTracks(parent.id);
        return parent.tracks;
    }
};
const Artist = {
    tracks: async (parent, args) => {
        if (!parent.tracks)
            return spotifyApis_1.getArtistTracks(parent.id);
        return parent.tracks;
    },
    albums: async (parent, args) => {
        if (!parent.albums)
            return spotifyApis_1.getArtistAlbums(parent.id);
        return parent.albums;
    },
    relatedArtists: async (parent, args) => {
        if (!parent.relatedArtists)
            return spotifyApis_1.getArtistRelatedArtists(parent.id);
        return parent.relatedArtists;
    }
};
const Playlist = {
    tracks: async (parent, args) => {
        if (!parent.tracks)
            return spotifyApis_1.getPlaylistTracks(parent.id);
        return parent.tracks;
    }
};
const Room = {
    adminUser: async (parent, args) => {
        const userDoc = await firestore_1.default
            .firestore()
            .doc(`users/${parent.adminId}`)
            .get();
        const user = userDoc.data() || undefined;
        return user;
    },
    songs: async (parent, args) => {
        const songCollection = await firestore_1.default
            .firestore()
            .collection(`rooms/${parent.id}/songs`)
            .get();
        const songs = songCollection.docs.map((song) => song.data());
        return songs.sort((a, b) => b.score - a.score);
    },
    users: async (parent, args) => {
        const userDocs = await firestore_1.default
            .firestore()
            .collection(`rooms/${parent.id}/users`)
            .get();
        return userDocs.docs.map((user) => user.data());
    }
};
exports.typeResolvers = {
    Room,
    Album,
    Playlist,
    Artist
};
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
//# sourceMappingURL=typedefs.js.map