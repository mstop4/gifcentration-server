import express from 'express'
import rClient from '../helpers/redis_db'

const router = express.Router()

router.get('/', (req, res) => {
  rClient.get('test', (err, reply) => {
    res.send(reply)
  })
})

router.post('/', (req, res) => {
  rClient.set('test', req.query.str, (err, reply) => {
    res.send(reply)
  })
})

module.exports = router