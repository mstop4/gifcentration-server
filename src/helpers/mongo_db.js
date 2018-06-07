import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

let isConnected = false

mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connected to database via Mongoose')
  isConnected = true
})

// Search schema
const searchSchema = mongoose.Schema({
  query: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now }
})

const Search = mongoose.model('Search', searchSchema)

const addSearch = (query) => {
  if (isConnected) {
    const newSearch = new Search({ query: query })
    newSearch.save((err, search) => {
      if (err) {
        console.log(err)
        return false
      } else {
        console.log(search.query)
        return true
      }
    })
  } else {
    return false
  }
}

module.exports = {
  isConnected: isConnected,
  db: db,
  addSearch: addSearch
}