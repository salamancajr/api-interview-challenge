import * as http from 'http'
import pg from 'pg'
import { randomUUID } from 'crypto'
import { parse as urlParse } from 'url'
import * as redis from 'redis'
import { promisify } from 'util'

const { DATABASE_URL, PORT, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } =
  process.env

const redisClient = redis.createClient()

await redisClient.connect().then(console.log)

await redisClient.set('test', 'good')
// const setAsync = promisify(redisClient.set).bind(redisClient)
// const getAsync = promisify(redisClient.get).bind(redisClient)
// await setAsync('all', JSON.stringify('comments.rows')).then(console.log)
console.log('test')
// const all = await getAsync('all')
// console.log('///////', { all })
