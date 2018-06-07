import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connected to database via Mongoose')
})

// Search schema
const searchSchema = mongoose.Schema({
  query: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now }
})

const Search = mongoose.model('Search', searchSchema)

module.exports = {
  db: db,
  Search: Search
}