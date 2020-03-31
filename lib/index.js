"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const typedefs_1 = require("./schema/typedefs");
const resolvers_1 = __importDefault(require("./schema/resolvers"));
const apollo_server_express_1 = require("apollo-server-express");
// import bodyParser from 'body-parser'
const PORT = 4000;
function parseCookies(request) {
    var list = {}, rc = request.headers.cookie;
    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}
// const app = express();
// app.use(cors({ origin: 'http://localhost:3000',  credentials: true  }))
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: typedefs_1.typeDefs,
    resolvers: resolvers_1.default,
    context: ({ req, connection }) => {
        if (connection) {
            // check connection for metadata
            return connection.context;
        }
        return { cookies: parseCookies(req) };
    },
});
const app = express_1.default();
app.use(cors_1.default({ origin: 'http://localhost:3000', credentials: true }));
server.applyMiddleware({ app, cors: false });
const httpServer = http_1.default.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
//# sourceMappingURL=index.js.map