import express from 'express'
import redis from 'redis'

const router = express.Router()
const client = redis.createClient()

client.on('connect', () => {
  console.log('Redis connected on port 6379')
})

router.get('/', (req, res) => {
  client.get('test', (err, reply) => {
    res.send(reply)
  })
})

router.post('/', (req, res) => {
  client.set('test', req.query.str, (err, reply) => {
    res.send(reply)
  })
})

module.exports = router