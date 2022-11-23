import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './helpers/graphql-schema.mjs'
import { resolvers } from './helpers/graphql-resolvers.mjs'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT },
})

console.log(`🚀 Server ready at: ${url}`)
