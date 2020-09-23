import express from 'express'
import { typeDefs } from "./schema/typedefs"
import resolvers from "./schema/resolvers"
import { ApolloServer } from 'apollo-server-express'
import { swapHandler, refreshHandler } from "./spotify/refreshToken"
import bodyParser from 'body-parser'

require('dotenv').config();

const PORT = 4000
function parseCookies (request) {
    var list = {},
    rc = request.headers.cookie;
    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, connection }) => { 
        if (connection) {
            // check connection for metadata
            return connection.context;
        } 
        return { cookies: parseCookies(req) }
    },
});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json())

app.post('/swap', swapHandler)
app.post('/refresh', refreshHandler)

server.applyMiddleware({ app, cors: { origin: 'http://localhost:3000', credentials: true } });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at path ${server.graphqlPath}`)
)