import pg from 'pg'

const { DATABASE_URL } = process.env

export const dbClient = new pg.Pool({
  connectionString: DATABASE_URL,
})

try {
  await dbClient.connect()
  console.log('connected to database')
} catch (err) {
  console.error('database connection error', err.stack)
}
