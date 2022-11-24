# api-interview-challenge

A simple REST API in node.js to store anonymous comments in a SQL db

# instructions for how to start up

Run the following command to start the server:

```bash
$ npm run start:docker
```

The nodejs server contains the following url signatures:

```bash
http://localhost:4000/comments/list
http://localhost:4000/comments/create
http://localhost:4000/comments/delete
```

The grahql server uses http://localhost:8000 and contains the following schema:

```
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
```
