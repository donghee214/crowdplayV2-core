import cors from 'cors'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import spotify from "./spotify/serverAuth"

const schema = require('./schema/schema')
const app = express();

app.use(cors());

app.use('/graphql', cors(), graphqlHTTP({
    schema,
    graphiql: true
}));


app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});