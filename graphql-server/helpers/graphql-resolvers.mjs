import { httpRequest } from './http-request.mjs'

export const resolvers = {
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

      console.log({ comments })
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
