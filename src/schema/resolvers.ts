import Queries from "./query"
import Mutations from "./mutation"
import Subscriptions from "./subscription"
import { typeResolvers } from './typedefs'

// const { PubSub } = require('apollo-server');

export default {
    Query: Queries,
    Mutation: Mutations,
    Subscription: Subscriptions,
    ...typeResolvers
}