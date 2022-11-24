export const typeDefs = `
  type Comment {
    commentid: String!
    text: String!
    createdat: String!
  }

  type StatusObject {
    status: String
    message: String
    path: String
    method: String
  } 
  
  type Query {
    listComments: [Comment]
  }
  
  type Mutation {
    deleteComment(commentId: String!): StatusObject
    createComment(text: String!): StatusObject
  }
`
