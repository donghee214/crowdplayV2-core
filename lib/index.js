"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typedefs_1 = require("./schema/typedefs");
const resolvers_1 = __importDefault(require("./schema/resolvers"));
const apollo_server_express_1 = require("apollo-server-express");
const refreshToken_1 = require("./spotify/refreshToken");
const body_parser_1 = __importDefault(require("body-parser"));
// console.log(require('dotenv').config({ path: require('find-config')('.env') }))
require('dotenv').config();
const PORT = 4000;
function parseCookies(request) {
    var list = {}, rc = request.headers.cookie;
    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}
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
app.use(express_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.post('/swap', refreshToken_1.swapHandler);
app.post('/refresh', refreshToken_1.refreshHandler);


server.applyMiddleware({ app, cors: { origin: 'http://localhost:3000', credentials: true } });
app.listen({ port: PORT }, () => console.log(`🚀 Server ready at path ${server.graphqlPath}`));
//# sourceMappingURL=index.js.map