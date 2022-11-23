import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { httpRequest } from './http-request.mjs'

const typeDefs = `
  type Comment {
    commentid: String!
    text: String!
  }

  type StatusObject {
    status: String
  }

  type DeletePayload {
    commentId: String!
  }
  
  type Query {
    listComments: [Comment]
  }
  
  type Mutation {
    deleteComment(commentId: String!): StatusObject
    createComment(text: String!): StatusObject
  }
`

const resolvers = {
  Query: {
    listComments: async () => {
      const comments = await httpRequest({
        path: '/comments/list',
        method: 'GET',
      })
      return comments
    },
  },
  Mutation: {
    deleteComment: async (parent, args, context, info) => {
      console.log({ commentId: args.commentId })
      const comments = await httpRequest({
        path: `/comments/delete?commentId=${args.commentId}`,
        method: 'DELETE',
      })
      return comments
    },
    createComment: async (parent, args) => {
      console.log('text argument in createComment resolver:', args.text)
      const comments = await httpRequest(
        {
          path: `/comments/create`,
          method: 'POST',
        },
        { text: args.text }
      )
      return comments
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT },
})

console.log(`🚀 Server ready at: ${url}`)
