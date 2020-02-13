"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_graphql_1 = __importDefault(require("express-graphql"));
const schema = require('./schema/schema');
const app = express_1.default();
app.use(cors_1.default());
app.use('/graphql', cors_1.default(), express_graphql_1.default({
    schema,
    graphiql: true
}));
app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
//# sourceMappingURL=index.js.map