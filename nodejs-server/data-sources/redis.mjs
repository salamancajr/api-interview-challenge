import * as redis from 'redis'

const { REDIS_HOST, REDIS_PORT } = process.env

export const redisClient = redis.createClient({
  legacyMode: true,
  socket: {
    port: REDIS_PORT,
    host: REDIS_HOST,
  },
})

await redisClient.connect().then(console.log).catch(console.error)

export const setCache = payload =>
  new Promise((resolve, reject) => {
    redisClient.set('comments', JSON.stringify(payload), (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })

export const getCache = () =>
  new Promise((resolve, reject) => {
    redisClient.get('comments', (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })

export const delCacheKey = () =>
  new Promise((resolve, reject) => {
    redisClient.del('comments', (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
