import * as http from 'http'
import pg from 'pg'
import { randomUUID } from 'crypto'
import { parse as urlParse } from 'url'

const { DATABASE_URL, PORT } = process.env

const dbClient = new pg.Pool({
  connectionString: DATABASE_URL,
})

try {
  await dbClient.connect()
  console.log('connected to database')
} catch (err) {
  console.error('database connection error', err.stack)
}

http
  .createServer(async (req, res) => {
    const { url, method } = req
    console.log(url)
    console.log(method)

    const sendResJSON = (status, payload) => {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = status
      res.end(JSON.stringify(payload))
    }

    try {
      if (url === '/comments/list' && method === 'GET') {
        const comments = await dbClient.query(`SELECT * FROM comments`)
        console.log({ comments: comments.rows })
        if (comments.rows) {
          sendResJSON(200, comments.rows)
        } else {
          sendResJSON(404, { message: 'No comments in db' })
        }
      } else if (url === '/comments/create' && method === 'POST') {
        let body = ''
        req.on('data', function (chunk) {
          body += chunk
        })

        req.on('end', async () => {
          if (!body) {
            sendResJSON(400, {
              message: 'No request body provided',
            })
            return
          }
          const requestBody = JSON.parse(body)

          if (!requestBody?.text) {
            sendResJSON(400, {
              message: 'No text provided for comment',
            })
            return
          }

          await dbClient.query(`CREATE TABLE IF NOT EXISTS comments (
          commentId uuid PRIMARY KEY,
          text VARCHAR(200)
        )`)

          const query = {
            text: 'INSERT INTO comments(commentId, text) VALUES($1, $2)',
            values: [randomUUID(), requestBody.text],
          }

          const res = await dbClient.query(query)
          console.log({ res })
          sendResJSON(201, { status: 'ok' })
        })
      } else if (method === 'DELETE') {
        const parsedURL = urlParse(url, true)
        console.log('parsedURL.pathname', parsedURL.pathname)
        if (parsedURL.pathname !== '/comments/delete') {
          sendResJSON(404, { message: 'Not Found', path: url, method: method })
          return
        }
        const query = parsedURL.query
        const commentId = query.commentId

        await dbClient.query(
          `DELETE from comments WHERE commentId='${commentId}'`
        )
        sendResJSON(200, { status: 'ok' })
      } else {
        sendResJSON(404, { message: 'Not Found', path: url, method: method })
      }
    } catch (err) {
      sendResJSON(500, { message: err.message, path: url, method: method })
    }
  })
  .listen(PORT)

console.log(`Server running at http://127.0.0.1:${PORT}/`)
