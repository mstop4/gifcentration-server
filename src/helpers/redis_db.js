import redis from 'redis'

const client = redis.createClient()

client.on('connect', () => {
  console.log('Redis connected on port 6379')
})

module.exports = client