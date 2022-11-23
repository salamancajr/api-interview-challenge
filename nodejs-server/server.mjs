import * as http from 'http'
import { randomUUID } from 'crypto'
import { parse as urlParse } from 'url'
import {
  getCache,
  setCache,
  redisClient,
  delCacheKey,
} from './data-sources/redis.mjs'
import { dbClient } from './data-sources/postgres.mjs'

const { PORT } = process.env

http
  .createServer(async (req, res) => {
    const { url, method } = req
    console.log(url)
    console.log(method)

    const sendResJSON = (status, payload, isString) => {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = status

      res.end(isString ? payload : JSON.stringify(payload))
    }

    try {
      if (url === '/comments/list' && method === 'GET') {
        const cache = await getCache()
        if (cache) {
          console.log('Grabbing from cache', cache)
          sendResJSON(200, cache, true)
          return
        }
        console.log('No cache available')
        const comments = await dbClient.query(`SELECT * FROM comments`)
        console.log({ commentsLength: comments.rows?.length })
        if (comments.rows) {
          await setCache(comments.rows)
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
          text VARCHAR(200),
          createdAt TIMESTAMP default CURRENT_TIMESTAMP
        )`)
          const randomUUIDVal = randomUUID()

          const query = {
            text: 'INSERT INTO comments(commentId, text) VALUES($1, $2)',
            values: [randomUUIDVal, requestBody.text],
          }

          const res = await dbClient.query(query)
          console.log({ res })

          await delCacheKey('comments')
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

        await delCacheKey('comments')
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
