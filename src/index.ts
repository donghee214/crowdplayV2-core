import cors from 'cors'
import http from 'http'
import express from 'express'
import { typeDefs } from "./schema/typedefs"
import resolvers from "./schema/resolvers"
import { ApolloServer } from 'apollo-server-express'
// import bodyParser from 'body-parser'

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
    }
});

const app = express();
app.use(cors());

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})