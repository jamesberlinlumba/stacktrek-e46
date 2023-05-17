import { MongoClient, ServerApiVersion } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config()

const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

await client.connect()

console.log('Connected to MongoDB')

const dbName = process.env.MONGODB_DBNAME
const db = client.db(dbName)
const todoCollection = db.collection('todo')

export { todoCollection }